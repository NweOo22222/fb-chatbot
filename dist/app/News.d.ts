import User from "./User";
export default class News {
    user: User;
    webhookEvent?: any;
    constructor(user: User, webhookEvent?: any);
    handle(): any[];
    latestNews(): {
        text: string;
    } | {
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
    handleDelete(): any[];
    update(): Promise<any[]>;
    updateArticles(): Promise<any>;
    fetchAll(): Promise<unknown>;
}
//# sourceMappingURL=News.d.ts.map