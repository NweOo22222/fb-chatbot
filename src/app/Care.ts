import User from "./User";
import Response from "./Response";
import GraphAPI from "./GraphAPI";
import Profile from "./Profile";

export default class Care {
  constructor(public user: User, public webhookEvent?: any) {}

  handle() {
    if (this.webhookEvent.postback) {
      return this.handlePayload(this.webhookEvent.postback.payload);
    }
    if (typeof this.user.talk_to_agent === "number") {
      this.user.talk_to_agent++;
    } else {
      this.user.talk_to_agent = 1;
    }
    if (this.webhookEvent.message === "bye") {
      return this.stopAgent();
    }
    return [];
  }

  handlePayload(payload: string): Array<object> {
    switch (payload) {
      case "CARE_HELP":
        return this.defaultFallback();
      case "CARE_OTHER":
      case "CARE_AGENT_START":
        return this.talkToAgent();
      case "CARE_AGENT_STOP":
        return this.stopAgent();
      case "CARE_RATING_GOOD":
      case "CARE_RATING_NULL":
        return [
          Response.genText(
            "အခုလိုဖြေကြားပေးတဲ့အတွက် ကျေးဇူးထူးတင်ရှိပါတယ်ခင်ဗျာ။"
          ),
        ];
      case "CARE_RATING_BAD":
        this.user.mode = "suggestion";
        return [
          Response.genText(
            "အဆင်မပြေတဲ့အတွက်စိတ်မကောင်းပါဘူးဗျာ။ ဘာများလိုအပ်လဲဆိုတာပြောပေးပါအုံးဗျာ..."
          ),
        ];
    }
    this.user.talk_to_agent++;
    return [];
  }

  handleSuggestion() {
    if (this.webhookEvent.postback) {
      return this.handle();
    }
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    return [Response.genText("")];
  }

  defaultFallback() {
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    return [
      Response.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
        {
          title: "သတင်းပေး",
          payload: "NEWS_REPORTING",
        },
        {
          title: "သတင်းယူ",
          payload: "NEWS_GETTING",
        },
        {
          title: "အခြား",
          payload: "CARE_OTHER",
        },
      ]),
    ];
  }

  talkToAgent() {
    if (this.user.mode === "agent") {
      return [];
    }
    this.user.mode = "agent";
    this.user.talk_to_agent = 0;
    return [
      Response.genButtonTemplate(
        "သက်ဆိုင်ရာနဲ့ အမြန်ဆုံးပြန်လည်ဆက်သွယ်ပေးပါ့မယ်ခင်ဗျာ။ ရပ်တန့်လိုပါက bye ဟုပို့၍ယခုဆက်သွယ်မှုကိုပယ်ဖျက်နိုင်ပါတယ်ခင်ဗျာ။",
        [Response.genPostbackButton("ပယ်ဖျက်ရန်", "CARE_AGENT_STOP")]
      ),
    ];
  }

  stopAgent() {
    let response = [];
    response.push(Response.genText("မင်္ဂလာရှိသောနေ့ရက်ဖြစ်ပါစေခင်ဗျာ။"));
    if (this.user.talk_to_agent > 2) {
      let feedback = Response.genQuickReply(
        "အခုဆက်သွယ်မေးမြန်းတဲ့အပေါ် အဆင့်သတ်မှတ်ပေးပါဦးဗျ။",
        [
          {
            title: "😀",
            payload: "CARE_RATING_GOOD",
          },
          {
            title: "😐",
            payload: "CARE_RATING_NULL",
          },
          {
            title: "🙁",
            payload: "CARE_RATING_BAD",
          },
        ]
      );
      feedback["delay"] = 3000;
      response.push(feedback);
    }
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    return response;
  }
}
