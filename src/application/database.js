import mysql from "mysql";
import { logger } from "./logging.js";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME,
    connectionLimit: process.env.CONNECTION_LIMIT,
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error(err);
    } else {
        connection.on("error", (e) => {
            logger.error(e);
        });

        connection.on("warn", (e) => {
            logger.warn(e);
        });

        connection.on("info", (e) => {
            logger.info(e);
        });

        connection.on("query", (e) => {
            logger.info(e);
        });

        connection.release();
    }
});
