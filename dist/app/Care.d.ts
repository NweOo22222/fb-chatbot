import User from "./User";
export default class Care {
    user: User;
    webhookEvent?: any;
    constructor(user: User, webhookEvent?: any);
    handle(): any[];
    handlePayload(payload: string): Array<object>;
    handleSuggestion(): any[];
    defaultFallback(): {
        text: string;
        quick_replies: any[];
    }[];
    talkToAgent(): import("./Response").ButtonTemplate[];
    stopAgent(): any[];
}
//# sourceMappingURL=Care.d.ts.map