export const DEFAULT_SLEEP_TIME = 500; // add delay to all requests for UI

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}
