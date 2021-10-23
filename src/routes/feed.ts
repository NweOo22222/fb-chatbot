import { Router } from "express";
import Feed from "../app/Feed";

const { VERIFY_TOKEN } = process.env;
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
      if ("changes" in entry) {
        res.sendStatus(200);
        let { field, value } = entry.changes[0];
        if (field === "feed") {
          new Feed(value).handle();
        } else if ("videos" in field) {
        } else {
          console.log("Unsupported changed event:", field);
        }
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

export default router;
