"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var GraphAPI_1 = __importDefault(require("./app/GraphAPI"));
var Receive_1 = __importDefault(require("./app/Receive"));
var User_1 = __importDefault(require("./app/User"));
var VERIFY_TOKEN = process.env.VERIFY_TOKEN;
var router = express_1.Router();
var users = {};
router.get("/webhook", function (req, res) {
    var mode = req.query["hub.mode"];
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            res.status(200).send(challenge);
        }
        else {
            res.sendStatus(403);
        }
    }
});
router.post("/webhook", function (req, res) {
    var body = req.body;
    if (body.object !== "page")
        return res.sendStatus(404);
    res.status(200).send("EVENT_RECEIVED");
    body.entry.forEach(function (entry) {
        if ("changes" in entry) {
            var receiveMessage = new Receive_1.default(null);
            if (entry.changes[0].field === "feed") {
                var change = entry.changes[0].value;
                switch (change.item) {
                    case "post":
                        return receiveMessage.handlePrivateReply("post_id", change.post_id);
                    case "comment":
                        return receiveMessage.handlePrivateReply("comment_id", change.comment_id);
                    default:
                        console.log("Unsupported feed change type.");
                        return;
                }
            }
        }
        var webhookEvent = entry.messaging[0];
        if ("read" in webhookEvent || "delivery" in webhookEvent) {
            return;
        }
        var psid = webhookEvent.sender.id;
        if (!(psid in users)) {
            var user_1 = new User_1.default(psid);
            GraphAPI_1.default.getUserProfile(psid)
                .then(function (userProfile) {
                user_1.setProfile(userProfile);
            })
                .catch(function (error) {
                console.log("Profile is unavailable:", error);
            })
                .finally(function () {
                users[psid] = user_1;
                var receiveMessage = new Receive_1.default(users[psid], webhookEvent);
                return receiveMessage.handleMessage();
            });
        }
        else {
            var receiveMessage = new Receive_1.default(users[psid], webhookEvent);
            return receiveMessage.handleMessage();
        }
    });
});
exports.default = router;