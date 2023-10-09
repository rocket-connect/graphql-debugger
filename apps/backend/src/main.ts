import { BACKEND_PORT } from "./config";
import { debug } from "./debug";
import { start } from "./index";

start({ port: BACKEND_PORT })
  .then(() => {
    debug("Online");
  })
  .catch((error) => {
    debug(error);
    process.exit(1);
  });
