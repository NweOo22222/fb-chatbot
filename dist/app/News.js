"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Care_1 = __importDefault(require("./Care"));
const DB_1 = __importDefault(require("./DB"));
const Message_1 = __importDefault(require("./Message"));
const Report_1 = __importDefault(require("./Report"));
const Response_1 = __importDefault(require("./Response"));
const { APP_URL } = process.env;
let updated_at;
class News {
    constructor(user, webhookEvent) {
        this.user = user;
        this.webhookEvent = webhookEvent;
    }
    handle() {
        var _a;
        let event = this.webhookEvent;
        if ((_a = event.message) === null || _a === void 0 ? void 0 : _a.text) {
            return this.handleDelete();
        }
        this.user.mode = "default";
        return [new Care_1.default(this.user, this.webhookEvent).defaultFallback()];
    }
    latestNews() {
        this.fetchAll();
        let remain;
        let max = 10;
        let user = this.user;
        let read = user.headlines;
        let articles = DB_1.default.read()["articles"] || [];
        let templates = [];
        articles = articles.filter((article) => !read.includes(article.id));
        remain = articles.length - max;
        articles = articles.slice(0, max);
        for (let article of articles) {
            let fb = `https://facebook.com/${article.post_id}`;
            let url = `https://nweoo.com/articles/${article.id}`;
            let template = Response_1.default.GenericTemplate(article.image, article.title, article.source, { type: "web_url", url, webview_height_ratio: "tall" }, [Response_1.default.genWebUrlButton("အပြည့်အစုံ", fb, "tall")]);
            read.push(article.id);
            templates.push(template);
        }
        if (!templates.length) {
            return Response_1.default.genText("သတင်းများနောက်ထပ်မရှိပါ။");
        }
        return [Response_1.default.genGenericTemplate(templates)];
    }
    handlePayload(payload) {
        switch (payload) {
            case "NEWS_DELETE_CANCEL":
                this.user.mode = "default";
                return new Care_1.default(this.user, this.webhookEvent).defaultFallback();
            case "NEWS_REPORT_DELETE":
                return this.handleDelete();
            case "NEWS_GETTING_MESSENGER":
            case "NEWS_ANOTHER":
            case "NEWS_GETTING":
                return this.latestNews();
            case "NEWS_REPORTING":
                return [
                    Response_1.default.genQuickReply("ဘယ်လိုသတင်းပေးလိုပါသလဲ။", [
                        {
                            title: "SMS",
                            payload: "NEWS_REPORTING_SMS",
                        },
                        {
                            title: "Messenger",
                            payload: "NEWS_REPORTING_MESSENGER",
                        },
                    ]),
                ];
            case "NEWS_GETTING_SMS":
                return [
                    Response_1.default.genQuickReply("တယ်လီနောအသုံးပြုသူများအနေနဲ့ 09758035929 ကို news (သို့) သတင်း လို့ SMS ပေးပို့ပြီး သတင်းခေါင်းစဉ်များကိုရယူနိုင်ပါတယ်။", [{ title: "Messenger", payload: "NEWS_GETTING_MESSENGER" }]),
                ];
            case "NEWS_REPORTING_SMS":
                return [
                    Response_1.default.genText("ဖုန်းနံပါတ် 09758035929 ကို #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို SMS နဲ့ပေးပို့လိုက်တာနဲ့ အမြန်ဆုံးကျွန်တော်တို့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"),
                ];
            case "NEWS_REPORTING_MESSENGER":
                return [
                    Response_1.default.genText("ဒီကနေ #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို ပို့လိုက်တာနဲ့ ချက်ချင်းကျွန်တော်တို့ရဲ့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"),
                ];
        }
        return [];
    }
    handleDelete() {
        var _a;
        let response = [];
        let message = ((_a = this.webhookEvent.message) === null || _a === void 0 ? void 0 : _a.text) || "";
        let user = this.user;
        let psid = this.user.psid;
        if (message != "" && user.mode === "delete") {
            let receive = new Message_1.default(user, this.webhookEvent);
            user.mode = null;
            if ("_reportid" in user.store) {
                psid = message;
                message = user.store["_reportid"];
                delete user.store["_reportid"];
            }
            Report_1.default.remove(message, psid)
                .then(() => {
                this.user.reports = this.user.reports.filter((id) => id != message);
                let response = Response_1.default.genQuickReply("ပေးပို့ချက် ID #" + message + " ကို ဖျက်လိုက်ပါပြီးခင်ဗျ...", [
                    {
                        title: "ပြန်လည်စတင်ရန်",
                        payload: "GET_STARTED",
                    },
                ]);
                receive.sendMessage(response);
            })
                .catch((e) => {
                this.user.mode = "delete";
                this.user.store["_reportid"] = message;
                let response = Response_1.default.genQuickReply(`လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပေးပို့ချက် #${message} ကိုပို့ဆောင်ခဲ့သောသူ၏ ဖုန်းနံပါတ် (သို့မဟုတ်) အကောင့် ID ကိုထည့်သွင်းပါ။`, [
                    {
                        title: "ပယ်ဖျက်ရန်",
                        payload: "NEWS_DELETE_CANCEL",
                    },
                ]);
                receive.sendMessage(response, 1400);
            })
                .finally(() => receive.sendAction("typing_off", 1200));
            receive.sendAction("typing_on", 200);
        }
        else {
            if (this.user.reports.length) {
                response = [
                    Response_1.default.genQuickReply("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ကို ထည့်သွင်းပါ။", [
                        ...this.user.reports.map((id) => ({
                            title: id,
                            payload: "NEWS_REPORT_DELETE",
                        })),
                    ]),
                ];
            }
            else {
                response = [Response_1.default.genText("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ထည့်သွင်းပါ။")];
            }
            this.user.mode = "delete";
        }
        return response;
    }
    update() {
        updated_at = Date.now();
        return this.updateArticles()
            .then((articles) => articles.reverse());
    }
    updateArticles() {
        return axios_1.default
            .get("https://api.nweoo.com/news/articles?limit=30")
            .then(({ data }) => data);
    }
    fetchAll() {
        let diff = Date.now() - updated_at;
        return new Promise((resolve, reject) => {
            if (diff < 3000000) {
                resolve(DB_1.default.read()["articles"]);
            }
            else {
                this.update()
                    .then((articles) => {
                    let db = DB_1.default.read();
                    db.articles = articles;
                    DB_1.default.save(db);
                    resolve(articles);
                })
                    .catch((e) => reject(e));
            }
        });
    }
}
exports.default = News;
