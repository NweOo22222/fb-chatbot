import { Request, Response } from "express";
import crypto from "crypto";

const { APP_SECRET } = process.env;

export default function verify(req: Request, res: Response, buf) {
  return;
  var signature = String(req.headers["x-hub-signature"]);
  if (!signature) {
    console.log("Couldn't validate the signature.");
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha1", APP_SECRET)
      .update(buf)
      .digest("hex");
    var body = req.body || {};
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
