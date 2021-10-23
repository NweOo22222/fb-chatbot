import Care from "./Care";
import User from "./User";

type SenderAction = "typing_on" | "typing_off" | "mark_seen";
type QuickReplyType = "text" | "user_phone_number" | "user_email";
type AttachmentType = "template";
type TemplateType = "one_time_notif_req" | "button";
type ButtonType = "web_url" | "postback" | "phone_number";
type WebviewHeightRatio = "compact" | "tall" | "full";

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
  static genTypingAction() {
    return [
      this.genSenderAction("typing_on"),
      this.genSenderAction("typing_off"),
    ];
  }

  static genSenderAction(sender_action: SenderAction) {
    return { sender_action };
  }

  static genOneTimeNotification(title: string, payload: string) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "one_time_notif_req",
          title,
          payload,
        },
      },
    };
  }

  static followUpOneTimeNotifcation(message: string) {
    return this.genText(message);
  }

  static genQuickReply(text: string, quickReplies: Array<QuickReply>) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let reply of quickReplies) {
      response.quick_replies.push({
        content_type: reply.content_type || "text",
        title: reply.title,
        payload: reply.payload,
      });
    }

    return response;
  }

  static genGenericTemplate(elements: Array<GenericTemplate>) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        },
      },
    };
  }

  static GenericTemplate(
    image_url: string,
    title: string,
    subtitle: string,
    default_action?: Button | Array<Button>,
    buttons?: Array<Button>
  ) {
    let response: GenericTemplate = {
      title,
      image_url,
      subtitle,
    };

    if (Array.isArray(default_action)) {
      response.buttons = buttons;
    } else {
      response.default_action = default_action;
    }

    if (buttons) {
      response.buttons = buttons;
    }

    return response;
  }

  static genImageTemplate(elements: Array<ImageTemplate>) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        },
      },
    };
  }

  static ImageTemplate(
    image_url: string,
    title: string,
    subtitle?: string
  ): ImageTemplate {
    let response = {
      image_url,
      title,
      subtitle: subtitle || "",
    };

    return response;
  }

  static genButtonTemplate(
    text: string,
    buttons: Array<Button>
  ): ButtonTemplate {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text,
          buttons,
        },
      },
    };
  }

  static genText(text: string) {
    return { text };
  }

  static genTextWithPersona(text: string, persona_id: string) {
    return {
      text,
      persona_id,
    };
  }

  static genPostbackButton(title: string, payload: string): Button {
    return {
      type: "postback",
      title,
      payload,
    };
  }

  static genWebUrlButton(
    title: string,
    url: string,
    webview_height_ratio?: WebviewHeightRatio
  ): Button {
    return {
      type: "web_url",
      title,
      url,
      webview_height_ratio: webview_height_ratio || "full",
      messenger_extensions: true,
    };
  }

  static genNuxMessage(user: User) {
    let welcome = this.genText(`မင်္ဂလာပါ။`);
    let curation = new Care(user).defaultFallback();

    return [welcome, ...curation];
  }
}
