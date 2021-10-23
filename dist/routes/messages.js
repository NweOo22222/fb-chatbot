"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Message_1 = __importDefault(require("../app/Message"));
const User_1 = __importDefault(require("../app/User"));
const { VERIFY_TOKEN } = process.env;
const users = {};
const histories = [];
const router = express_1.Router();
router.get("/", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (!(mode && token))
        return res.sendStatus(400);
    if (!(mode === "subscribe" && token === VERIFY_TOKEN))
        return res.sendStatus(403);
    res.status(200).send(challenge);
});
router.post("/", (req, res) => {
    if (req.body.object === "page") {
        req.body.entry.forEach((entry) => {
            histories.unshift(entry);
            histories.length > 20 && histories.pop();
            if ("messaging" in entry) {
                res.sendStatus(200);
                let event = entry.messaging[0];
                let psid = event["sender"]["id"];
                if ("read" in event || "delivery" in event)
                    return;
                if (!(psid in users))
                    users[psid] = new User_1.default(psid);
                new Message_1.default(users[psid], event).handle();
            }
            else {
                console.log("Unsuported event field:", ...Object.keys(entry));
            }
        });
    }
    else {
        res.status(204).end();
    }
});
router.get("/histories", (req, res) => {
    if (req.query.token !== VERIFY_TOKEN)
        return res.sendStatus(403).end();
    res.json(histories);
});
router.get("/update", (req, res) => {
    if (req.query.token !== VERIFY_TOKEN)
        return res.sendStatus(403).end();
    res.end();
});
exports.default = router;
