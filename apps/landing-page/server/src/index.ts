import cors from "cors";
import express from "express";
import expressStaticGzip from "express-static-gzip";
import path from "path";

const config = {
  STATIC_FOLDER: path.join(__dirname, "../../app/build"),
  HTTP_PORT: 5000,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(expressStaticGzip(config.STATIC_FOLDER, {}));
app.use(express.static("public"));

app.get("*", expressStaticGzip(config.STATIC_FOLDER, {}));
app.use("*", expressStaticGzip(config.STATIC_FOLDER, {}));

async function main() {
  await app.listen(config.HTTP_PORT);

  console.log(`Listening at http://localhost:${config.HTTP_PORT}`);
}

main();
