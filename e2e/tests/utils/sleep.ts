import util from "util";

// This function is used to wait an amount of ms
// We use this in the e2e to wait for the page to load, spinners to stop, etc.
// - use with caution.
export function sleep(ms: number) {
  return util.promisify(setTimeout)(ms);
}
