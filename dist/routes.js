"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const News_1 = __importDefault(require("./app/News"));
const feed_1 = __importDefault(require("./routes/feed"));
const messages_1 = __importDefault(require("./routes/messages"));
const router = express_1.Router();
setTimeout(() => new News_1.default(null).fetchAll(), 3000);
router.get("/", (req, res) => res.send("STATUS_OK"));
router.use("/feed", feed_1.default);
router.use("/messages", messages_1.default);
exports.default = router;
