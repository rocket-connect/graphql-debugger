import cors from "cors";
import express from "express";
import path from "path";

const config = {
  STATIC_FOLDER: path.join(__dirname, "../../app/build"),
  HTTP_PORT: 5000,
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

async function main() {
  await app.listen(config.HTTP_PORT);

  console.log(`Listening at http://localhost:${config.HTTP_PORT}`);
}

main();
