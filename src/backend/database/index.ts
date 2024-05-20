import mysql from "mysql2";
import config from "./config.json";

let configuration = config.development;
const { NODE_ENV } = process.env;

if (NODE_ENV === "production") configuration = config.production;
else if (NODE_ENV === "test") configuration = config.test;

export default mysql.createPool(configuration.database).promise();
