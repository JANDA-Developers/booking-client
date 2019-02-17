import dotenv from "dotenv";
dotenv.config();

import { Options } from "graphql-yoga";
import { connect } from "mongoose";
import app from "./app";

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string =
    process.env.PLAYGROUND_ENDPOINT || "/playground";
const GRAPHQL_ENDPOINT: string = process.env.GRAPHQL_ENDPOINT || "/graphql";

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT
};

const handleAppStart = () => {
    console.log(
        `Listening on http://localhost:${PORT}${
            process.env.PLAYGROUND_ENDPOINT
        }`
    );
};

connect(
    `mongodb+srv://${process.env.DB_USER}:${
        process.env.DB_PASSWORD
    }@cluster0-gk4ly.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
    {
        useNewUrlParser: true
    }
)
    .then(connection => {
        app.start(appOptions, handleAppStart);
    })
    .catch(err => {
        console.log(err);
    });
