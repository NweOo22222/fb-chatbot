export type PSID = string | number;

export type Recipient = {
  id: PSID;
};

export type MessageBody = {
  recipient: Recipient;
  message: Object;
  persona_id?: PSID;
};

export type QuickReplies = {
  //
};

export type Postback = {
  payload: string;
};

export type Attachment = {
  //
};

export type Message = {
  quick_replies?: QuickReplies;
  attachments?: Array<Attachment>;
  text?: string;
};

export type Referral = {
  ref: string;
};

export type WebhookEvent = {
  message?: Message;
  postback?: Object;
  referral?: Object;
};
