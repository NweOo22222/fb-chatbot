import { Router } from "express";
import News from "./app/News";
import feed from "./routes/feed";
import messages from "./routes/messages";

const router = Router();

setTimeout(() => new News(null).fetchAll(), 3000);

router.get("/", (req, res) => res.send("STATUS_OK"));

router.use("/feed", feed);

router.use("/messages", messages);

export default router;
