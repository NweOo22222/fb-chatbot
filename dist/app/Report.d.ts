import Receive from "./Message";
export default class Report {
    handleMessage(message: string, recieve: Receive): {
        text: string;
    }[];
    static send(phone: string, message: string): Promise<{
        id: any;
        post_id: any;
    }>;
    static remove(id: string | number, token: string | number): Promise<any>;
}
//# sourceMappingURL=Report.d.ts.map