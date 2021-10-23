"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const { APP_SECRET } = process.env;
function verify(req, res, buf) {
    return;
    var signature = String(req.headers["x-hub-signature"]);
    if (!signature) {
        console.log("Couldn't validate the signature.");
    }
    else {
        var elements = signature.split("=");
        var signatureHash = elements[1];
        var expectedHash = crypto_1.default
            .createHmac("sha1", APP_SECRET)
            .update(buf)
            .digest("hex");
        var body = req.body || {};
        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
}
exports.default = verify;
