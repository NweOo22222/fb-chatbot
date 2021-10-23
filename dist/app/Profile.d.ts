import User from "./User";
export default class Profile {
    user: User | null;
    constructor(user: User | null);
    setWebhook(): Promise<any>;
    setPageFeedWebhook(): Promise<any>;
    setThread(text?: string, menu?: object): Promise<any>;
    setGetStarted(): Promise<any>;
    setGreeting(): Promise<any>;
    setPersistentMenu(): Promise<any>;
    setWhitelistedDomains(): Promise<any>;
    getGetStarted(): {
        get_started: {
            payload: string;
        };
    };
    getGreeting(text?: string): {
        greeting: {
            locale: string;
            text: string;
        }[];
    };
    getPersistentMenu(menu?: object): {
        persistent_menu: {
            locale: string;
            composer_input_disabled: boolean;
            call_to_actions: {
                type: string;
                title: string;
                payload: string;
            }[];
        }[];
    };
    getGreetingText(): {
        locale: string;
        text: string;
    };
    getMenuItems(): {
        locale: string;
        composer_input_disabled: boolean;
        call_to_actions: {
            type: string;
            title: string;
            payload: string;
        }[];
    };
    getWhitelistedDomains(): {
        whitelisted_domains: string[];
    };
}
//# sourceMappingURL=Profile.d.ts.map