//-------------------------------start imports-----------------------------
const Redis = require("ioredis");
const config = require("../config/config");
//-------------------------------end imports-------------------------------
//-------------------------------start code-------------------------------
exports.redisClient = new Redis(config.redis.url);
exports.redisClientForLimit = new Redis(config.redis.url, { enableOfflineQueue: false, db: 1 });
exports.redisClientForCache = new Redis(config.redis.url, { db: 2 });
