declare type Mode = "delete" | "agent" | "default" | "suggestion";
declare type Gender = "netural" | "male" | "female";
export default class User {
    psid: string;
    name: string;
    firstName: string;
    lastName: string;
    profileURL: string;
    times: number;
    gender: Gender;
    mode: Mode;
    persona_id?: string;
    headlines: string[];
    reports: string[];
    talk_to_agent?: number;
    last_report?: number;
    store: object;
    role: string;
    constructor(psid: string);
    setProfile(profile: object): void;
    get thirdPerson(): "သင်" | "အကို" | "အမ";
}
export {};
//# sourceMappingURL=User.d.ts.map