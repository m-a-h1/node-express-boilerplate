const AppError = require("../utils/appError");
const httpCodes = require("http-status");
const multer = require("multer");
const catchAsync = require("../utils/catchAsync");
const path = require("path");

const dest = path.join(process.cwd(), "temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      req.fileValidationError = "mimetypes is not correct. most be one of png, jpg or jpeg";
      return cb(new Error("use correct mimetypes"));
    }
  },
  limits: {
    fileSize: 4 * 1024 * 1024, // Maximum file size is 4MB
  },
}).single("image");

const uploader = catchAsync(async (req, res, next) => {
  upload(req, res, function (err) {
    try {
      if (req.fileValidationError) {
        throw new AppError(req.fileValidationError, httpCodes.FORBIDDEN);
      }
      /*             if ((req.file?.length === 0 || !(req.file))) {
                            return res.status(StatusCodes.BAD_REQUEST).send({ err: 'plz select a file' })
                        } */
      if (err) {
        console.log(err);
        throw new AppError(err.message, httpCodes.FORBIDDEN);
      }
    } catch (error) {
      console.log(error);
      return next(new AppError(error.message, httpCodes.BAD_REQUEST));
    }
    next();
  });
});

module.exports = { uploader };
