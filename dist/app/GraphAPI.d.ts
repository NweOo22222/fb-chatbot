export default class GraphAPI {
    static callSendAPI(requestBody: any): Promise<any>;
    static callMessengerProfileAPI(requestBody: any): Promise<any>;
    static callSubscriptionsAPI(customFields: any): Promise<any>;
    static callSubscribedApps(customFields: any): Promise<any>;
    static getUserProfile(senderPsid: any): Promise<any[]>;
    static callUserProfileAPI(psid: any): Promise<any[]>;
    static getPersonaAPI(): Promise<any[]>;
    static postPersonaAPI(name: string, profile_picture_url: string): Promise<any>;
    static callNLPConfigsAPI(): Promise<any>;
    static callFBAEventsAPI(senderPsid: any, eventName: any): Promise<any>;
    static callCustomUserSettings(senderPsid: any, requestBody: any): Promise<import("axios").AxiosResponse<any>>;
}
//# sourceMappingURL=GraphAPI.d.ts.map