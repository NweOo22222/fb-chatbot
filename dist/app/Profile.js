"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GraphAPI_1 = __importDefault(require("./GraphAPI"));
const { APP_URL, SHOP_URL } = process.env;
class Profile {
    constructor(user) {
        this.user = user;
    }
    setWebhook() {
        return GraphAPI_1.default.callSubscriptionsAPI("").then(() => GraphAPI_1.default.callSubscribedApps(""));
    }
    setPageFeedWebhook() {
        return GraphAPI_1.default.callSubscriptionsAPI("feed").then(() => GraphAPI_1.default.callSubscribedApps("feed"));
    }
    setThread(text, menu) {
        let profilePayload = Object.assign(Object.assign(Object.assign({}, this.getGetStarted()), this.getGreeting(text)), this.getPersistentMenu(menu));
        return GraphAPI_1.default.callMessengerProfileAPI(profilePayload);
    }
    setGetStarted() {
        let getStartedPayload = this.getGetStarted();
        return GraphAPI_1.default.callMessengerProfileAPI(getStartedPayload);
    }
    setGreeting() {
        let greetingPayload = this.getGreeting();
        return GraphAPI_1.default.callMessengerProfileAPI(greetingPayload);
    }
    setPersistentMenu() {
        let menuPayload = this.getPersistentMenu();
        return GraphAPI_1.default.callMessengerProfileAPI(menuPayload);
    }
    setWhitelistedDomains() {
        let domainPayload = this.getWhitelistedDomains();
        return GraphAPI_1.default.callMessengerProfileAPI(domainPayload);
    }
    getGetStarted() {
        return {
            get_started: {
                payload: "GET_STARTED",
            },
        };
    }
    getGreeting(text) {
        let greeting = [this.getGreetingText()];
        if (text)
            greeting[0].text = text;
        return { greeting };
    }
    getPersistentMenu(menu) {
        let persistent_menu = [this.getMenuItems()];
        if (menu)
            persistent_menu[0] = Object.assign(Object.assign({}, persistent_menu[0]), menu);
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
exports.default = Profile;
