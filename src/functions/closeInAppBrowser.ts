import { Response } from "express";

export function closeInAppBrowser(res: Response) {
  let url =
    "https://www.messenger.com/closeWindow/?image_url=https%3A%2F%2Fstorage.googleapis.com%2Fnwe-oo.appspot.com%2Fpublic%2F2021%2F05%2Fnweoo-bot-avatar.jpg&display_text=closing";
  res.redirect(url);
  res.end();
}
