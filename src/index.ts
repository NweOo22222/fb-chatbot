import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import cors from "cors";
import DB from "./app/DB";
import router from "./routes";

config();

const app = express();
const { PORT } = process.env;

DB.init();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors())

app.use(router);

app.listen(PORT || 3000, () => console.log("server (express) is serving"));
