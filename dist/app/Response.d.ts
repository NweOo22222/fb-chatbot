import User from "./User";
declare type SenderAction = "typing_on" | "typing_off" | "mark_seen";
declare type QuickReplyType = "text" | "user_phone_number" | "user_email";
declare type AttachmentType = "template";
declare type TemplateType = "one_time_notif_req" | "button";
declare type ButtonType = "web_url" | "postback" | "phone_number";
declare type WebviewHeightRatio = "compact" | "tall" | "full";
interface QuickReply {
    content_type?: QuickReplyType;
    title: string;
    payload: string;
}
export interface Button {
    type?: ButtonType;
    webview_height_ratio?: WebviewHeightRatio;
    title?: string;
    url?: string;
    payload?: string;
    image_url?: string;
    messenger_extensions?: Boolean;
}
export interface GenericTemplate {
    image_url: string;
    title: string;
    subtitle: string;
    default_action?: Button;
    buttons?: Array<Button>;
}
export interface ImageTemplate {
    image_url: string;
    title: string;
    subtitle: string;
    default_action?: Button;
    buttons?: Array<Button>;
}
interface Payload {
    template_type?: TemplateType;
    title?: string;
    subtitle?: string;
    image_url?: string;
    text?: string;
    payload?: string;
    buttons: Array<Button>;
}
interface Attachment {
    type?: AttachmentType;
    payload: Payload;
}
export interface ButtonTemplate {
    attachment: Attachment;
}
export default class Response {
    static genTypingAction(): {
        sender_action: SenderAction;
    }[];
    static genSenderAction(sender_action: SenderAction): {
        sender_action: SenderAction;
    };
    static genOneTimeNotification(title: string, payload: string): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                title: string;
                payload: string;
            };
        };
    };
    static followUpOneTimeNotifcation(message: string): {
        text: string;
    };
    static genQuickReply(text: string, quickReplies: Array<QuickReply>): {
        text: string;
        quick_replies: any[];
    };
    static genGenericTemplate(elements: Array<GenericTemplate>): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: GenericTemplate[];
            };
        };
    };
    static GenericTemplate(image_url: string, title: string, subtitle: string, default_action?: Button | Array<Button>, buttons?: Array<Button>): GenericTemplate;
    static genImageTemplate(elements: Array<ImageTemplate>): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: ImageTemplate[];
            };
        };
    };
    static ImageTemplate(image_url: string, title: string, subtitle?: string): ImageTemplate;
    static genButtonTemplate(text: string, buttons: Array<Button>): ButtonTemplate;
    static genText(text: string): {
        text: string;
    };
    static genTextWithPersona(text: string, persona_id: string): {
        text: string;
        persona_id: string;
    };
    static genPostbackButton(title: string, payload: string): Button;
    static genWebUrlButton(title: string, url: string, webview_height_ratio?: WebviewHeightRatio): Button;
    static genNuxMessage(user: User): {
        text: string;
    }[];
}
export {};
//# sourceMappingURL=Response.d.ts.map