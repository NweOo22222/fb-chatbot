import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

const DATABASE_PATH = resolve(dirname(__dirname), ".db.json");

export default class DB {
  static init() {
    existsSync(DATABASE_PATH) || this.save({ users: [], articles: [] });
  }

  static read() {
    return JSON.parse(readFileSync(DATABASE_PATH, "utf-8"));
  }

  static save(db) {
    writeFileSync(DATABASE_PATH, JSON.stringify(db), "utf-8");
  }
}
