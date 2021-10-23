"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Feed_1 = __importDefault(require("../app/Feed"));
const { VERIFY_TOKEN } = process.env;
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
            if ("changes" in entry) {
                res.sendStatus(200);
                let { field, value } = entry.changes[0];
                if (field === "feed") {
                    new Feed_1.default(value).handle();
                }
                else if ("videos" in field) {
                }
                else {
                    console.log("Unsupported changed event:", field);
                }
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
exports.default = router;
