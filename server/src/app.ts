import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import {sequelize} from "./config/DbConfig";
import errorMiddleware from "./middlewares/ErrorMiddleware";
import cookieParser from 'cookie-parser';
import router from "./router";
import corsMiddleware from "./middlewares/CorsMiddleware";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use('/auth-api', router);

app.use(errorMiddleware);


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Start server on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
}

start();
