import { yoga } from "@graphql-debugger/graphql-schema";

import cors from "cors";
import express, { Express } from "express";
import path from "path";

export const app: Express = express();
app.use(cors());
app.use("/graphql", yoga);
app.use(express.static(path.join(__dirname, "../../ui/build")));
app.use(express.static("public"));
