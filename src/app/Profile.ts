import GraphAPI from "./GraphAPI";
import User from "./User";

const { APP_URL, SHOP_URL } = process.env;

export default class Profile {
  constructor(public user: User | null) {}

  setWebhook() {
    return GraphAPI.callSubscriptionsAPI("").then(() =>
      GraphAPI.callSubscribedApps("")
    );
  }

  setPageFeedWebhook() {
    return GraphAPI.callSubscriptionsAPI("feed").then(() =>
      GraphAPI.callSubscribedApps("feed")
    );
  }

  setThread(text?: string, menu?: object) {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(text),
      ...this.getPersistentMenu(menu),
    };

    return GraphAPI.callMessengerProfileAPI(profilePayload);
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    return GraphAPI.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    return GraphAPI.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    return GraphAPI.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    return GraphAPI.callMessengerProfileAPI(domainPayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: "GET_STARTED",
      },
    };
  }

  getGreeting(text?: string) {
    let greeting = [this.getGreetingText()];
    if (text) greeting[0].text = text;
    return { greeting };
  }

  getPersistentMenu(menu?: object) {
    let persistent_menu = [this.getMenuItems()];
    if (menu) persistent_menu[0] = { ...persistent_menu[0], ...menu };
    return { persistent_menu };
  }

  getGreetingText() {
    return {
      locale: "default",
      text: "မင်္ဂလာပါ {{user_full_name}}။\nသတင်းမှန်များကို အချိန်နဲ့တပြေးညီ သိရှိနိုင်အောင် ဆောင်ရွက်ပေးနေပါတယ်။",
    };
  }

  getMenuItems() {
    return {
      locale: "default",
      composer_input_disabled: true,
      call_to_actions: [
        {
          type: "postback",
          title: "အကူအညီ",
          payload: "CARE_HELP",
        },
        {
          type: "postback",
          title: "ဆက်သွယ်ရန်",
          payload: "CARE_AGENT_START",
        },
      ],
    };
  }

  getWhitelistedDomains() {
    return {
      whitelisted_domains: [
        APP_URL,
        SHOP_URL,
        "https://nweoo.com",
        "https://api.nweoo.com",
        "https://www.nweoo.com",
        "https://facebook.com",
        "https://m.facebook.com",
        "https://www.facebook.com",
      ],
    };
  }
}
