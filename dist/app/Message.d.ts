import User from "./User";
export default class Message {
    user: User;
    webhookEvent?: any;
    constructor(user: User, webhookEvent?: any);
    handle(): void;
    handleTextMessage(): {
        text: string;
    } | {
        text: string;
    }[] | {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: import("./Response").GenericTemplate[];
            };
        };
    }[];
    handlePayload(payload: any): any[] | {
        text: string;
    };
    handleAttachmentMessage(): any[];
    handleQuickReply(): any[] | {
        text: string;
    };
    handlePostback(): any[] | {
        text: string;
    };
    handleReferral(): any[] | {
        text: string;
    };
    sendAction(action: any, delay?: number): void;
    sendMessage(response: any, delay?: number): void;
    firstEntity(nlp: any, name: any): any;
}
//# sourceMappingURL=Message.d.ts.map