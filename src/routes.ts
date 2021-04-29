import { Router } from "express";
import DB from "./app/DB";
import GraphAPI from "./app/GraphAPI";
import News from "./app/News";
import Profile from "./app/Profile";
import Receive from "./app/Receive";
import User from "./app/User";

const { APP_ID, PAGE_ID, VERIFY_TOKEN } = process.env;
const router = Router();
const users = {};

setTimeout(() => new News(null).fetchAll(), 3000);

router.get("/", (req, res) => {
  res.redirect("https://nweoo.com");
  res.end();
});

router.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (!(mode && token)) {
    return res.sendStatus(400);
  }
  if (!(mode === "subscribe" && token === VERIFY_TOKEN)) {
    return res.sendStatus(403);
  }
  res.status(200).send(challenge);
});

router.post("/webhook", (req, res) => {
  let body = req.body;
  if (body.object !== "page") return res.sendStatus(404);
  res.status(200).send("EVENT_RECEIVED");
  body.entry.forEach(function (entry) {
    if ("changes" in entry) {
      let receiveMessage = new Receive(null);
      if (entry.changes[0].field === "feed") {
        let change = entry.changes[0].value;
        switch (change.item) {
          case "post":
            return receiveMessage.handlePrivateReply("post_id", change.post_id);
          case "comment":
            return receiveMessage.handlePrivateReply(
              "comment_id",
              change.comment_id
            );
          default:
            console.log("Unsupported feed change type.");
            return;
        }
      }
    }

    let webhookEvent = entry.messaging[0];

    if ("read" in webhookEvent || "delivery" in webhookEvent) {
      return;
    }

    let psid = webhookEvent.sender.id;

    if (!(psid in users)) {
      let user = new User(psid);

      console.log("person id: %s", psid);

      GraphAPI.getUserProfile(psid)
        .then((userProfile) => {
          user.setProfile(userProfile);
        })
        .catch((error) => {
          console.log("Profile is unavailable:", error);
        })
        .finally(() => {
          users[psid] = user;
          let receiveMessage = new Receive(users[psid], webhookEvent);
          return receiveMessage.handleMessage();
        });
    } else {
      let receiveMessage = new Receive(users[psid], webhookEvent);
      return receiveMessage.handleMessage();
    }
  });
});

router.get("/articles/:id", (req, res) => {
  const id = req.params["id"];
  const articles = DB.read()["articles"];
  const article = articles.find((article) => article.id == id);
  if (!article) return res.sendStatus(404);
  res.render("../public/article.ejs", {
    APP_ID,
    PAGE_ID,
    ...article,
  });
});

router.get("/nweoo", (req, res) => {
  if (req.query["verify_token"] !== VERIFY_TOKEN) return res.sendStatus(403);
  const profile = new Profile(null);
  const news = new News(null);
  news.fetchAll();
  profile.setThread();
  profile.setWhitelistedDomains();
  res.send("1");
});

export default router;
