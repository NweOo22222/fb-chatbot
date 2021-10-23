"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Response_1 = __importDefault(require("./Response"));
class Report {
    handleMessage(message, recieve) {
        let user = recieve.user;
        if (user.last_report && Date.now() - user.last_report < 300000) {
            let text = "၅ မိနစ်လောက်ခြားပြီးမှပြန်ပို့ပေးပါခင်ဗျာ။ အခုလိုဆက်သွယ်ပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်။";
            return [Response_1.default.genText(text)];
        }
        Report.send(user.psid, message)
            .then(({ id, post_id }) => {
            let [__pageid, __postid] = post_id.split("_");
            user.last_report = new Date().getTime();
            user.reports.push(id);
            recieve.sendMessage(Response_1.default.genButtonTemplate(`သတင်းပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်ခင်ဗျာ။ သင့်ပေးပို့ချက် ID မှာ #${id} ဖြစ်ပါတယ်။`, [
                {
                    type: "web_url",
                    title: "ကြည့်ရှုရန်",
                    url: `https://facebook.com/${__pageid}/posts/${__postid}`,
                    webview_height_ratio: "tall",
                },
                Response_1.default.genPostbackButton("ပြန်ဖျက်ရန်", "NEWS_REPORT_DELETE"),
            ]), 1400);
        })
            .finally(() => recieve.sendAction("typing_off", 1200));
        recieve.sendAction("typing_on", 200);
        return [];
    }
    static send(phone, message) {
        message = message.replace(/#n[we]{2}oo/gim, "");
        if (!(message && message.length)) {
            throw new Error("message body is required");
        }
        return axios_1.default.post("https://api.nweoo.com/report", {
            phone,
            message,
            timestamp: Date.now(),
        }).then(({ data: { id, post_id } }) => ({
            id: id.toString(),
            post_id,
        }));
    }
    static remove(id, token) {
        return axios_1.default.delete(`https://api.nweoo.com/report/${id}?phone=${token}`).then(({ data }) => data);
    }
}
exports.default = Report;
