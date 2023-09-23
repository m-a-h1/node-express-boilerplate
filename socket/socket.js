//-------------------------------start imports-----------------------------
const { Server: SocketServer } = require("socket.io");
const jwt = require("jsonwebtoken");

const Room = require("../models/room.model");

const config = require("../config/config");
const User = require("../models/user.model");
//-------------------------------end imports-------------------------------
//-------------------------------start code-------------------------------
let io = null;

const socketUsers = new Map();
const userSockets = new Map();

exports.socketLoader = async (server) => {
  io = new SocketServer(server, config.socket);

  // eslint-disable-next-line no-use-before-define
  io.use(socketProtect).on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("join", async ({ roomId }) => {
      const find = socketUsers.get(socket.id);
      if (find) {
        try {
          const room = await Room.findById(roomId);

          if (!room) {
            socket.emit("error", "error");
            return;
          }

          if (!room.users.includes(find)) {
            socket.emit("error", "error");
            return;
          }

          socket.join(roomId);
        } catch (error) {
          socket.emit("error", "error");
        }
      } else {
        socket.emit("error", "error");
      }
    });

    socket.on("message", async (message) => {
      socket.send(message);
    });

    socket.on("leave", async ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      socket.disconnect();
      console.log("🔥: A user disconnected");

      const userId = socketUsers.get(socket.id);

      if (userId) {
        socketUsers.delete(socket.id);
        userSockets.delete(userId);
      }
    });
  });
};

exports.socketEmit = (event, ...rest) => {
  io.emit(event, ...rest);
};

exports.socketEmitPrivate = (socketId, event, ...rest) => {
  io.to(socketId).emit(event, ...rest);
};

exports.socketEmitToRoom = (room, event, ...rest) => {
  io.in(room).emit(event, ...rest);
};

exports.socketUsers = socketUsers;
exports.userSockets = userSockets;

const socketProtect = async (socket, next) => {
  const { token } = socket.handshake.query;
  if (!token) return next("error in socket");

  try {
    const decodeAccess = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decodeAccess.id);
    if (!user) throw new Error("user not found");

    socketUsers.set(socket.id, String(user._id));
    userSockets.set(String(user._id), socket.id);

    next();
  } catch (error) {
    return next(error.message);
  }
};
