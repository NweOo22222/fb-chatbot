import axios from "axios";
import Care from "./Care";
import DB from "./DB";
import Message from "./Message";
import Report from "./Report";
import Response from "./Response";
import User from "./User";

const { APP_URL } = process.env;

let updated_at: number;

export default class News {
  constructor(public user: User, public webhookEvent?: any) {}

  handle() {
    let event = this.webhookEvent;
    if (event.message?.text) {
      return this.handleDelete();
    }
    this.user.mode = "default";
    return [new Care(this.user, this.webhookEvent).defaultFallback()];
  }

  latestNews() {
    this.fetchAll();
    let remain;
    let max = 10;
    let user = this.user;
    let read = user.headlines;
    let articles = DB.read()["articles"] || [];
    let templates = [];

    articles = articles.filter((article) => !read.includes(article.id));
    remain = articles.length - max;
    articles = articles.slice(0, max);

    for (let article of articles) {
      let fb = `https://facebook.com/${article.post_id}`;
      let url = `https://nweoo.com/articles/${article.id}`;
      let template = Response.GenericTemplate(
        article.image,
        article.title,
        article.source,
        { type: "web_url", url, webview_height_ratio: "tall" },
        [Response.genWebUrlButton("အပြည့်အစုံ", fb, "tall")]
      );
      read.push(article.id);
      templates.push(template);
    }
    if (!templates.length) {
      return Response.genText("သတင်းများနောက်ထပ်မရှိပါ။");
    }
    return [Response.genGenericTemplate(templates)];
  }

  handlePayload(payload) {
    switch (payload) {
      case "NEWS_DELETE_CANCEL":
        this.user.mode = "default";
        return new Care(this.user, this.webhookEvent).defaultFallback();

      case "NEWS_REPORT_DELETE":
        return this.handleDelete();

      case "NEWS_GETTING_MESSENGER":
      case "NEWS_ANOTHER":
      case "NEWS_GETTING":
        return this.latestNews();

      case "NEWS_REPORTING":
        return [
          Response.genQuickReply("ဘယ်လိုသတင်းပေးလိုပါသလဲ။", [
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
          Response.genQuickReply(
            "တယ်လီနောအသုံးပြုသူများအနေနဲ့ 09758035929 ကို news (သို့) သတင်း လို့ SMS ပေးပို့ပြီး သတင်းခေါင်းစဉ်များကိုရယူနိုင်ပါတယ်။",
            [{ title: "Messenger", payload: "NEWS_GETTING_MESSENGER" }]
          ),
        ];

      case "NEWS_REPORTING_SMS":
        return [
          Response.genText(
            "ဖုန်းနံပါတ် 09758035929 ကို #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို SMS နဲ့ပေးပို့လိုက်တာနဲ့ အမြန်ဆုံးကျွန်တော်တို့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"
          ),
        ];

      case "NEWS_REPORTING_MESSENGER":
        return [
          Response.genText(
            "ဒီကနေ #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို ပို့လိုက်တာနဲ့ ချက်ချင်းကျွန်တော်တို့ရဲ့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"
          ),
        ];
    }

    return [];
  }

  handleDelete() {
    let response = [];
    let message = this.webhookEvent.message?.text || "";
    let user = this.user;
    let psid = this.user.psid;
    if (message != "" && user.mode === "delete") {
      let receive = new Message(user, this.webhookEvent);
      user.mode = null;
      if ("_reportid" in user.store) {
        psid = message;
        message = user.store["_reportid"];
        delete user.store["_reportid"];
      }
      Report.remove(message, psid)
        .then(() => {
          this.user.reports = this.user.reports.filter((id) => id != message);
          let response = Response.genQuickReply(
            "ပေးပို့ချက် ID #" + message + " ကို ဖျက်လိုက်ပါပြီးခင်ဗျ...",
            [
              {
                title: "ပြန်လည်စတင်ရန်",
                payload: "GET_STARTED",
              },
            ]
          );
          receive.sendMessage(response);
        })
        .catch((e) => {
          this.user.mode = "delete";
          this.user.store["_reportid"] = message;
          let response = Response.genQuickReply(
            `လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ ပေးပို့ချက် #${message} ကိုပို့ဆောင်ခဲ့သောသူ၏ ဖုန်းနံပါတ် (သို့မဟုတ်) အကောင့် ID ကိုထည့်သွင်းပါ။`,
            [
              {
                title: "ပယ်ဖျက်ရန်",
                payload: "NEWS_DELETE_CANCEL",
              },
            ]
          );
          receive.sendMessage(response, 1400);
        })
        .finally(() => receive.sendAction("typing_off", 1200));
      receive.sendAction("typing_on", 200);
    } else {
      if (this.user.reports.length) {
        response = [
          Response.genQuickReply("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ကို ထည့်သွင်းပါ။", [
            ...this.user.reports.map((id) => ({
              title: id,
              payload: "NEWS_REPORT_DELETE",
            })),
          ]),
        ];
      } else {
        response = [Response.genText("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ထည့်သွင်းပါ။")];
      }
      this.user.mode = "delete";
    }
    return response;
  }

  update() {
    updated_at = Date.now();
    return this.updateArticles()
      .then(
	(articles: any[]) => articles.reverse())
  }

  updateArticles() {
    return axios
      .get("https://api.nweoo.com/news/articles?limit=30")
      .then(({ data }) => data);
  }

  fetchAll() {
    let diff = Date.now() - updated_at;
    return new Promise((resolve, reject) => {
      if (diff < 3000000) {
        resolve(DB.read()["articles"]);
      } else {
        this.update()
          .then((articles) => {
            let db = DB.read();
            db.articles = articles;
            DB.save(db);
            resolve(articles);
          })
          .catch((e) => reject(e));
      }
    });
  }
}
