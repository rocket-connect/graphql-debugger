import { TimeStamp } from "./timestamp";

describe("TimeStamp", () => {
  describe("toStorage", () => {
    it("should return the input", () => {
      const now = new Date();

      const ts = new TimeStamp(now);

      expect(ts.toStorage()).toEqual(now);
    });
  });

  describe("toString", () => {
    it("should return a stringified version of the input", () => {
      const now = new Date();

      const ts = new TimeStamp(now);

      expect(ts.toString()).toEqual(now.toString());
    });
  });

  describe("moment", () => {
    it("should return the input in moment format", () => {
      const janfirst = new Date(2023, 0, 1);

      const ts = new TimeStamp(janfirst);

      expect(ts.moment.year()).toBe(2023);
    });
  });
});
