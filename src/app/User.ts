type Mode = "delete" | "agent" | "default" | "suggestion";
type Gender = "netural" | "male" | "female";

export default class User {
  public name: string;
  public firstName: string;
  public lastName: string;
  public profileURL: string;
  public times: number;
  public gender: Gender;
  public mode: Mode;
  public persona_id?: string;
  public headlines: string[];
  public reports: string[];
  public talk_to_agent?: number;
  public last_report?: number;
  public store: object;
  public role: string;

  constructor(public psid: string) {
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.profileURL = "";
    this.gender = "netural";
    this.mode = "default";
    this.headlines = [];
    this.reports = [];
    this.store = {};
    this.times = 0;
  }

  setProfile(profile: object) {
    this.firstName = profile["first_name"] || "";
    this.lastName = profile["last_name"] || "";
    this.profileURL = profile["profile_pic"] || "";
    this.gender = profile["profile_pic"] || "netural";
    this.name =
      profile["name"] || (this.firstName + " " + this.lastName).trim();
  }

  get thirdPerson() {
    if (this.gender === "netural") {
      return "သင်";
    }
    return this.gender === "male" ? "အကို" : "အမ";
  }
}
