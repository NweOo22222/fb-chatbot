export declare type PSID = string | number;
export declare type Recipient = {
    id: PSID;
};
export declare type MessageBody = {
    recipient: Recipient;
    message: Object;
    persona_id?: PSID;
};
export declare type QuickReplies = {};
export declare type Postback = {
    payload: string;
};
export declare type Attachment = {};
export declare type Message = {
    quick_replies?: QuickReplies;
    attachments?: Array<Attachment>;
    text?: string;
};
export declare type Referral = {
    ref: string;
};
export declare type WebhookEvent = {
    message?: Message;
    postback?: Object;
    referral?: Object;
};
//# sourceMappingURL=index.d.ts.map