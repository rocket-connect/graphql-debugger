import { yoga } from "@graphql-debugger/graphql-schema";
import { graphqlDebugger } from "@graphql-debugger/plugin-express";

import cors from "cors";
import express, { Express } from "express";
import path from "path";

import { TRACE_EXPRESS } from "./config";

export const app: Express = express();
app.use(cors());
app.use(express.json());
if (TRACE_EXPRESS) {
  app.use(graphqlDebugger());
}
app.use("/graphql", yoga);
app.use(express.static(path.join(__dirname, "../../ui/build")));
app.use(express.static("public"));
