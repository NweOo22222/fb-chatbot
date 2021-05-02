import Response from "./Response";
import News from "./News";
import GraphAPI from "./GraphAPI";
import User from "./User";
import Report from "./Report";
import Care from "./Care";

const NWEOO_BOT = "278599793960429";

export default class Receive {
  constructor(public user?: User, public webhookEvent?: any) {}

  handleMessage() {
    let responses;
    let event = this.webhookEvent;

    try {
      if (event.message) {
        let message = event.message;
        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
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
    } else {
      this.sendMessage(responses);
    }
  }

  handleTextMessage() {
    let message = this.webhookEvent.message?.text?.trim();
    let user = this.user;
    let response;

    switch (user.mode) {
      case "agent":
        let care = new Care(this.user, this.webhookEvent);
        if (Date.now() - this.user.talk_to_agent < 432000000) {
          return [
            Response.genQuickReply(
              "သတ်မှတ်ထားသောအချိန် ၂ နာရီပြည့်သွားပါပြီး။",
              [
                {
                  title: "ထပ်မံဆက်သွယ်ရန်",
                  payload: "CARE_AGENT_START",
                },
              ]
            ),
            ...care.stopAgent(),
          ];
        }
        return [];

      case "delete":
        let news = new News(this.user, this.webhookEvent);
        return news.handlePayload("NEWS_REPORT_DELETE");
    }

    if (message.match(/#n[we]{2}oo/gi)) {
      if (
        !this.user.last_report ||
        Date.now() - this.user.last_report > 300000
      ) {
        this.user.last_report = new Date().getTime();
        Report.send(this.user.psid, message)
          .then(({ id, post_id }) => {
            let [__pageid, __postid] = post_id.split("_");
            this.user.reports.push(id);
            this.sendMessage(
              Response.genButtonTemplate(
                `သတင်းပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်ခင်ဗျာ။ သင့်ပေးပို့ချက် ID မှာ #${id} ဖြစ်ပါတယ်။`,
                [
                  {
                    type: "web_url",
                    title: "ကြည့်ရှုရန်",
                    url: `https://facebook.com/${__pageid}/posts/${__postid}`,
                    webview_height_ratio: "tall",
                  },
                  Response.genPostbackButton(
                    "ပြန်ဖျက်ရန်",
                    "NEWS_REPORT_DELETE"
                  ),
                ]
              ),
              1400
            );
          })
          .finally(() => this.sendAction("typing_off", 1200));
        response = [];
        this.sendAction("typing_on", 200);
      } else {
        let text =
          "၅ မိနစ်လောက်ခြားပြီးမှပြန်ပို့ပေးပါခင်ဗျာ။ အခုလိုဆက်သွယ်ပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်။";
        response = [Response.genText(text)];
      }
      this.user.mode = null;
      return response;
    }

    if (message.match(/(?:news|သတင်း|သတငျး|ဘာထူးလဲ)/)) {
      return new News(this.user, this.webhookEvent).latestNews();
    }

    if (message.match(/my id/i)) {
      return [
        Response.genText(`သင်ရဲ့ ID မှာ ${this.user.psid} ဖြစ်ပါတယ်ခင်ဗျာ။`),
      ];
    }

    return new Care(this.user, this.webhookEvent).defaultFallback(message);
  }

  handlePayload(payload) {
    GraphAPI.callFBAEventsAPI(this.user.psid, payload);

    switch (this.user.mode) {
      case "agent":
        if (payload.includes("CARE")) {
          return new Care(this.user, this.webhookEvent).handlePayload(payload);
        }
        return [];

      case "delete":
        return new News(this.user, this.webhookEvent).handlePayload(payload);
    }

    if (payload.includes("CARE")) {
      return new Care(this.user, this.webhookEvent).handlePayload(payload);
    }

    this.user.mode = "default";

    if (payload.includes("NEWS")) {
      return new News(this.user, this.webhookEvent).handlePayload(payload);
    }

    switch (payload) {
      case "GET_STARTED":
      case "CHAT-PLUGIN":
        return Response.genNuxMessage(this.user);
    }

    return [];
  }

  handleAttachmentMessage() {
    let user = this.user;
    let store = user.store;
    let attachment = this.webhookEvent.message.attachments[0];

    if ("answer" in store) {
      if (store["answer"].includes("attachment")) {
        switch (store["class"]) {
          case "care":
            let care = new Care(this.user, this.webhookEvent);
            if (attachment.payload.type == store["answer"].split(":").pop()) {
              return care[store["callback"]](attachment.payload);
            }
        }
      }
      user.store = {};
    }

    return [
      Response.genQuickReply(
        "အခုလိုဆက်သွယ်တဲ့အတွက် ကျေးဇူးတင်ရှိပါတယ်ခင်ဗျာ...",
        [
          {
            title: "ပြန်လည်စတင်ရန်",
            payload: "GET_STARTED",
          },
        ]
      ),
    ];
  }

  handleQuickReply() {
    let payload = this.webhookEvent.message.quick_reply.payload;
    return this.handlePayload(payload);
  }

  handlePostback() {
    let payload: string = "";
    let postback = this.webhookEvent.postback;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  handleReferral() {
    let payload = this.webhookEvent.referral.ref.toUpperCase();
    return this.handlePayload(payload);
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage = "မင်္ဂလာပါ။ ဘာများကူညီပေးရမလဲခင်ဗျ။";

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: "သတင်းယူရန်",
        payload: "NEWS_GETTING",
      },
      {
        title: "သတင်းပေးရန်",
        payload: "NEWS_REPORTING",
      },
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id,
      },
      message: response,
    };

    GraphAPI.callSendAPI(requestBody);
  }

  sendAction(action, delay = 0) {
    let requestBody = {
      recipient: {
        id: this.user.psid,
      },
      sender_action: action.toUpperCase(),
    };

    setTimeout(() => GraphAPI.callSendAPI(requestBody), delay);
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
      persona_id: NWEOO_BOT,
    };

    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
        persona_id,
      };
    }

    setTimeout(() => GraphAPI.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
}
