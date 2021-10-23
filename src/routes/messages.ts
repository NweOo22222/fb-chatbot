import { Router } from "express";
import Message from "../app/Message";
import User from "../app/User";

interface UserObject {
  [psid: string]: User;
}

const { VERIFY_TOKEN } = process.env;
const users: UserObject = {};
const histories: Array<object> = [];
const router = Router();

router.get("/", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (!(mode && token)) return res.sendStatus(400);
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
        let event: object = entry.messaging[0];
        let psid: string = event["sender"]["id"];
        if ("read" in event || "delivery" in event) return;
        if (!(psid in users)) users[psid] = new User(psid);
        new Message(users[psid], event).handle();
      } else {
        console.log("Unsuported event field:", ...Object.keys(entry));
      }
    });
  } else {
    res.status(204).end();
  }
});

router.get("/histories", (req, res) => {
  if (req.query.token !== VERIFY_TOKEN) return res.sendStatus(403).end();
  res.json(histories);
});

router.get("/update", (req, res) => {
  if (req.query.token !== VERIFY_TOKEN) return res.sendStatus(403).end();
  res.end();
});

export default router;
