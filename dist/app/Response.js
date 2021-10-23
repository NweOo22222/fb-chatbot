"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Care_1 = __importDefault(require("./Care"));
class Response {
    static genTypingAction() {
        return [
            this.genSenderAction("typing_on"),
            this.genSenderAction("typing_off"),
        ];
    }
    static genSenderAction(sender_action) {
        return { sender_action };
    }
    static genOneTimeNotification(title, payload) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "one_time_notif_req",
                    title,
                    payload,
                },
            },
        };
    }
    static followUpOneTimeNotifcation(message) {
        return this.genText(message);
    }
    static genQuickReply(text, quickReplies) {
        let response = {
            text: text,
            quick_replies: [],
        };
        for (let reply of quickReplies) {
            response.quick_replies.push({
                content_type: reply.content_type || "text",
                title: reply.title,
                payload: reply.payload,
            });
        }
        return response;
    }
    static genGenericTemplate(elements) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements,
                },
            },
        };
    }
    static GenericTemplate(image_url, title, subtitle, default_action, buttons) {
        let response = {
            title,
            image_url,
            subtitle,
        };
        if (Array.isArray(default_action)) {
            response.buttons = buttons;
        }
        else {
            response.default_action = default_action;
        }
        if (buttons) {
            response.buttons = buttons;
        }
        return response;
    }
    static genImageTemplate(elements) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements,
                },
            },
        };
    }
    static ImageTemplate(image_url, title, subtitle) {
        let response = {
            image_url,
            title,
            subtitle: subtitle || "",
        };
        return response;
    }
    static genButtonTemplate(text, buttons) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text,
                    buttons,
                },
            },
        };
    }
    static genText(text) {
        return { text };
    }
    static genTextWithPersona(text, persona_id) {
        return {
            text,
            persona_id,
        };
    }
    static genPostbackButton(title, payload) {
        return {
            type: "postback",
            title,
            payload,
        };
    }
    static genWebUrlButton(title, url, webview_height_ratio) {
        return {
            type: "web_url",
            title,
            url,
            webview_height_ratio: webview_height_ratio || "full",
            messenger_extensions: true,
        };
    }
    static genNuxMessage(user) {
        let welcome = this.genText(`မင်္ဂလာပါ။`);
        let curation = new Care_1.default(user).defaultFallback();
        return [welcome, ...curation];
    }
}
exports.default = Response;
