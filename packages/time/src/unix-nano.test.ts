import { UnixNanoTimeStamp } from "./unix-nano";

describe("UnixNanoTimeStamp", () => {
  describe("getBigInt", () => {
    it("should return the input cast to a bigint", () => {
      const ts = new UnixNanoTimeStamp(100);

      const bi = ts.getBigInt();

      expect(typeof bi).toEqual("bigint");
      expect(bi).toEqual(BigInt(100));
    });
  });

  describe("toStorage", () => {
    it("should return the input cast to a bigint", () => {
      const ts = new UnixNanoTimeStamp(100);

      const bi = ts.toStorage();

      expect(typeof bi).toEqual("bigint");
      expect(bi).toEqual(BigInt(100));
    });
  });

  describe("toString", () => {
    it("should return the input as a string", () => {
      const ts = new UnixNanoTimeStamp(100);

      expect(ts.toString()).toEqual("100");
    });
  });

  describe("fromString", () => {
    it("should create a UnixNanoTimeStamp from a numeric string", () => {
      const ts = UnixNanoTimeStamp.fromString("100");

      expect(Number(ts.getBigInt())).toBe(100);
    });
  });

  describe("toMS", () => {
    it("should return the number of ms in the timestamp", () => {
      const ts = new UnixNanoTimeStamp(1694342543499);

      expect(ts.toMS()).toBe(1694342);
    });
  });

  describe("toSIUnits", () => {
    it.each([
      { value: 1.23, unit: "s", input: "1230000000" },
      { value: 123.456, unit: "ms", input: "123456000" },
      { value: 123.456, unit: "μs", input: "123456" },
      { value: 123, unit: "ns", input: "123" },
    ])("should return $value $unit", ({ value, unit, input }) => {
      const ts = UnixNanoTimeStamp.fromString(input);

      expect(ts.toSIUnits()).toEqual({
        value,
        unit,
      });
    });
  });

  describe("calculateWidthAndOffset", () => {
    const minTimestamp = UnixNanoTimeStamp.fromString("1694213499416000000");
    const maxTimestamp = UnixNanoTimeStamp.fromString("1694213500062032384");

    it.each([
      {
        duration: UnixNanoTimeStamp.fromString("347276288"),
        startTimestamp: UnixNanoTimeStamp.fromString("1694213499416000000"),
        width: "53%",
        offset: "0%",
      },
      {
        duration: UnixNanoTimeStamp.fromString("297915904"),
        startTimestamp: UnixNanoTimeStamp.fromString("1694213499764000000"),
        width: "46%",
        offset: "53%",
      },
      {
        duration: UnixNanoTimeStamp.fromString("32256"),
        startTimestamp: UnixNanoTimeStamp.fromString("1694213500062000128"),
        width: "5%",
        offset: "99%",
      },
    ])(
      "should return a $width width and $offset offset",
      ({ duration, startTimestamp, width, offset }) => {
        expect(
          duration.calculateWidthAndOffset(
            startTimestamp,
            minTimestamp,
            maxTimestamp,
          ),
        ).toEqual({ width, offset });
      },
    );
  });

  describe("toTimeStamp", () => {
    it("should return a new TimeStamp", () => {
      const unts = new UnixNanoTimeStamp(BigInt(1694368087997));

      const ts = unts.toTimeStamp();

      expect(ts.moment.year()).toBe(2023);
    });
  });

  describe("duration", () => {
    it("should return the duration between two timestamps", () => {
      const from = new UnixNanoTimeStamp(300);
      const to = new UnixNanoTimeStamp(550);

      expect(UnixNanoTimeStamp.duration(from, to).getBigInt()).toBe(
        BigInt(250),
      );
    });
  });

  describe("average", () => {
    it("should average a list of UnixNanoTimeStamps", () => {
      const time1 = new UnixNanoTimeStamp(10);
      const time2 = new UnixNanoTimeStamp(20);
      const time3 = new UnixNanoTimeStamp(30);

      expect(UnixNanoTimeStamp.average([time1, time2, time3]).getBigInt()).toBe(
        BigInt(20),
      );
    });

    it("should return 1 if the list is empty", () => {
      expect(UnixNanoTimeStamp.average([]).getBigInt()).toBe(BigInt(1));
    });

    it("should set the numerator to 1 if the total timestamps are 0", () => {
      const time1 = new UnixNanoTimeStamp(0);
      const time2 = new UnixNanoTimeStamp(0);
      const time3 = new UnixNanoTimeStamp(0);

      expect(UnixNanoTimeStamp.average([time1, time2, time3]).getBigInt()).toBe(
        BigInt(0),
      );
    });
  });

  describe("earliest", () => {
    it("should find the earliest timestamp in an array", () => {
      const time1 = new UnixNanoTimeStamp(20);
      const time2 = new UnixNanoTimeStamp(10);
      const time3 = new UnixNanoTimeStamp(30);

      expect(
        UnixNanoTimeStamp.earliest([time1, time2, time3]).getBigInt(),
      ).toBe(BigInt(10));
    });
  });

  describe("latest", () => {
    it("should find the latest timestamp in an array", () => {
      const time1 = new UnixNanoTimeStamp(20);
      const time2 = new UnixNanoTimeStamp(10);
      const time3 = new UnixNanoTimeStamp(30);

      expect(UnixNanoTimeStamp.latest([time1, time2, time3]).getBigInt()).toBe(
        BigInt(30),
      );
    });
  });

  describe("subtract", () => {
    it("should subtract one timestamp from another", () => {
      const ts = new UnixNanoTimeStamp(100);
      const anotherTs = new UnixNanoTimeStamp(30);

      expect(ts.subtract(anotherTs).getBigInt()).toBe(BigInt(70));
    });

    it("should subtract one bigint from a timestamp", () => {
      const ts = new UnixNanoTimeStamp(100);
      const another = BigInt(30);

      expect(ts.subtract(another).getBigInt()).toBe(BigInt(70));
    });
  });

  describe("divide", () => {
    it("should divide a timestamp by a bigint", () => {
      const ts = new UnixNanoTimeStamp(100);

      expect(ts.divide(BigInt(2)).getBigInt()).toBe(BigInt(50));
    });
  });

  describe("multiply", () => {
    it("should multiply a timestamp by a bigint", () => {
      const ts = new UnixNanoTimeStamp(100);

      expect(ts.multiply(BigInt(2)).getBigInt()).toBe(BigInt(200));
    });
  });
});
