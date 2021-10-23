"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const { API_URL, PAGE_ID } = process.env;
class Feed {
    constructor(context) {
        this.context = context;
    }
    handle() {
        var _a;
        let context = this.context;
        switch (context.item) {
            case "comment":
                return this.handleComment();
            case "like":
            case "reaction":
                return;
        }
        if (((_a = context.from) === null || _a === void 0 ? void 0 : _a.id) != PAGE_ID) {
            if ("photo" in context) {
                axios_1.default
                    .post(`${API_URL}/fb/photo`, context)
                    .catch((e) => console.log(e, "[ERROR]"));
            }
            else if ("video" in context) {
                axios_1.default
                    .post(`${API_URL}/fb/video`, context)
                    .catch((e) => console.log(e, "[ERROR]"));
            }
            else if ("post_id" in context) {
                axios_1.default
                    .post(`${API_URL}/fb/post`, context)
                    .catch((e) => console.log(e, "[ERROR]"));
            }
            else {
                console.log("changed: unspported");
            }
            console.log(" -", ...Object.keys(context));
        }
    }
    handleComment() {
        let context = this.context;
        axios_1.default
            .post(`${API_URL}/fb/comment`, context)
            .catch((e) => console.log(e, "error"));
    }
    handleAddedPost() { }
}
exports.default = Feed;
