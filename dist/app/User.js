"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(psid) {
        this.psid = psid;
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
    setProfile(profile) {
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
exports.default = User;
