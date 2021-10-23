"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const camelcase_1 = __importDefault(require("camelcase"));
const { APP_ID, APP_SECRET, APP_URL, PAGE_ID, PAGE_ACCESS_TOKEN, VERIFY_TOKEN, } = process.env;
class GraphAPI {
    static callSendAPI(requestBody) {
        let uri = new URL("https://graph.facebook.com/v10.0/me/messages");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .post(uri.toString(), requestBody)
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    }
    static callMessengerProfileAPI(requestBody) {
        let uri = new URL("https://graph.facebook.com/v10.0/me/messenger_profile");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .post(uri.toString(), requestBody)
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    }
    static callSubscriptionsAPI(customFields) {
        let fields = "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";
        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }
        let uri = new URL(`https://graph.facebook.com/v10.0/${APP_ID}/subscriptions`);
        let search = uri.searchParams;
        search.append("access_token", `${APP_ID}|${APP_SECRET}`);
        search.append("object", "page");
        search.append("callback_url", `${APP_URL}/webhook`);
        search.append("verify_token", VERIFY_TOKEN);
        return axios_1.default
            .post(uri.toString(), customFields)
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    }
    static callSubscribedApps(customFields) {
        let fields = "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";
        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }
        let uri = new URL("https://graph.facebook.com/v10.0/me/subscribed_apps");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        search.append("subscribed_fields", fields);
        return axios_1.default
            .post(uri.toString())
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    }
    static async getUserProfile(senderPsid) {
        try {
            const userProfile = await this.callUserProfileAPI(senderPsid);
            for (const key in userProfile) {
                const camelizedKey = camelcase_1.default(key);
                const value = userProfile[key];
                delete userProfile[key];
                userProfile[camelizedKey] = value;
            }
            return userProfile;
        }
        catch (err) {
            console.log("Fetch failed:", err);
        }
    }
    static callUserProfileAPI(psid) {
        let uri = new URL(`https://graph.facebook.com/v10.0/${psid}`);
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        search.append("fields", "first_name, last_name, gender");
        return axios_1.default
            .get(uri.toString())
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    }
    static getPersonaAPI() {
        let uri = new URL("https://graph.facebook.com/v10.0/personas");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .get(uri.toString())
            .then(({ data }) => data["data"])
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    }
    static postPersonaAPI(name, profile_picture_url) {
        let requestBody = { name, profile_picture_url };
        let uri = new URL("https://graph.facebook.com/v10.0/me/personas");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .post(uri.toString(), requestBody)
            .then(({ data }) => data["id"])
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    }
    static callNLPConfigsAPI() {
        let uri = new URL("https://graph.facebook.com/v10.0/me/nlp_configs");
        let search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        search.append("nlp_enabled", "1");
        return axios_1.default
            .post(uri.toString())
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    }
    static callFBAEventsAPI(senderPsid, eventName) {
        let requestBody = {
            event: "CUSTOM_APP_EVENTS",
            custom_events: JSON.stringify([
                {
                    _eventName: "postback_payload",
                    _value: eventName,
                    _origin: "original_coast_clothing",
                },
            ]),
            advertiser_tracking_enabled: 1,
            application_tracking_enabled: 1,
            extinfo: JSON.stringify(["mb1"]),
            page_id: PAGE_ID,
            page_scoped_user_id: senderPsid,
        };
        return axios_1.default
            .post(`https://graph.facebook.com/v10.0/${APP_ID}/activities`, requestBody)
            .then(({ data }) => data)
            .catch((e) => { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    }
    static callCustomUserSettings(senderPsid, requestBody) {
        requestBody.psid = senderPsid;
        return axios_1.default.post("https://graph.facebook.com/v10.0/me/custom_user_settings?access_token=" +
            PAGE_ACCESS_TOKEN, requestBody);
    }
}
exports.default = GraphAPI;
