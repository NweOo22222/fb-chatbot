"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = __importDefault(require("./Response"));
const News_1 = __importDefault(require("./News"));
const GraphAPI_1 = __importDefault(require("./GraphAPI"));
const Report_1 = __importDefault(require("./Report"));
const Care_1 = __importDefault(require("./Care"));
class Message {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
        user.times++;
    }
    handle() {
        let responses;
        let user = this.user;
        let event = this.webhookEvent;
        try {
            switch (user.mode) {
                case "agent":
                    responses = new Care_1.default(user, event).handle();
                    break;
                case "delete":
                    responses = new News_1.default(user, event).handle();
                    break;
                case "suggestion":
                    responses = new Care_1.default(user, event).handleSuggestion();
                    break;
                default:
                    if (event.message) {
                        let message = event.message;
                        if (message.quick_reply) {
                            responses = this.handleQuickReply();
                        }
                        else if (message.attachments) {
                            responses = this.handleAttachmentMessage();
                        }
                        else if (message.text) {
                            responses = this.handleTextMessage();
                        }
                    }
                    else if (event.postback) {
                        responses = this.handlePostback();
                    }
                    else if (event.referral) {
                        responses = this.handleReferral();
                    }
            }
        }
        catch (error) {
            responses = {
                text: `နည်းပညာပိုင်းအရချို့ယွင်းမှုရှိနေပါတယ်။ \n\n---\n${error}`,
            };
        }
        if (Array.isArray(responses)) {
            let delay = 0;
            for (let response of responses) {
                this.sendMessage(response, delay * 1200);
                delay++;
            }
        }
        else {
            this.sendMessage(responses);
        }
    }
    handleTextMessage() {
        let message = this.webhookEvent.message.text.trim();
        if (message.match(/#n[we]{2}oo/gi)) {
            return new Report_1.default().handleMessage(message, this);
        }
        if (message.match(/^(?:news|သတင်း|သတငျး|ဘာထူးလဲ)$/i)) {
            return new News_1.default(this.user, this.webhookEvent).latestNews();
        }
        if (message.match(/my id/i)) {
            return [
                Response_1.default.genText(`${this.user.thirdPerson}၏ အကောင့် ID မှာ`),
                Response_1.default.genText(this.user.psid),
            ];
        }
        if (this.user.times > 2)
            return [];
        return new Care_1.default(this.user, this.webhookEvent).defaultFallback();
    }
    handlePayload(payload) {
        if (payload.includes("CARE")) {
            return new Care_1.default(this.user, this.webhookEvent).handlePayload(payload);
        }
        this.user.mode = "default";
        if (payload.includes("NEWS")) {
            return new News_1.default(this.user, this.webhookEvent).handlePayload(payload);
        }
        switch (payload) {
            case "GET_STARTED":
            case "CHAT-PLUGIN":
                return Response_1.default.genNuxMessage(this.user);
        }
        return [];
    }
    handleAttachmentMessage() {
        let user = this.user;
        let store = user.store;
        let attachment = this.webhookEvent.message.attachments[0];
        return [];
    }
    handleQuickReply() {
        let payload = this.webhookEvent.message.quick_reply.payload;
        return this.handlePayload(payload);
    }
    handlePostback() {
        let postback = this.webhookEvent.postback;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            return this.handlePayload(postback.referral.ref.toUpperCase());
        }
        return this.handlePayload(postback.payload.toUpperCase());
    }
    handleReferral() {
        let payload = this.webhookEvent.referral.ref.toUpperCase();
        return this.handlePayload(payload);
    }
    sendAction(action, delay = 0) {
        let requestBody = {
            recipient: {
                id: this.user.psid,
            },
            sender_action: action.toUpperCase(),
        };
        setTimeout(() => GraphAPI_1.default.callSendAPI(requestBody), delay);
    }
    sendMessage(response, delay = 0) {
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }
        let requestBody = {
            recipient: {
                id: this.user.psid,
            },
            message: response,
        };
        if ("persona_id" in response) {
            let persona_id = response["persona_id"];
            delete response["persona_id"];
            requestBody = {
                recipient: {
                    id: this.user.psid,
                },
                message: response,
            };
        }
        setTimeout(() => GraphAPI_1.default.callSendAPI(requestBody), delay);
    }
    firstEntity(nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    }
}
exports.default = Message;
