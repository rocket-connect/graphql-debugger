import { TimeStamp } from "./timestamp";

/** BigInt representation of a second */
const s = BigInt(1_000_000_000);
/** BigInt representation of a millisecond */
const ms = BigInt(1_000_000);
/** BigInt representation of a microsecond */
const us = BigInt(1_000);

/** Helper constant for calculating percentages without losing resolution */
const percentageMultiplyer = BigInt(100);
/** Helper constant representing the number 1 */
const bigintOne = BigInt(1);

export class UnixNanoTimeStamp {
  private input: number | bigint;

  constructor(input: number | bigint) {
    this.input = input;
  }

  public getBigInt(): bigint {
    return BigInt(this.input);
  }

  public toStorage(): bigint {
    return this.getBigInt();
  }

  public toString(): string {
    return this.getBigInt().toString();
  }

  public static fromString(input: string): UnixNanoTimeStamp {
    return new UnixNanoTimeStamp(BigInt(input));
  }

  public toMS(): number {
    const _ms = Number(this.getBigInt() / ms);

    return _ms;
  }

  public toSIUnits(): {
    value: number;
    unit: "s" | "ms" | "μs" | "ns";
  } {
    const bigintInput = this.getBigInt();

    if (bigintInput >= s) {
      return {
        value: Number(this.multiply(s).divide(s).getBigInt()) / Number(s),
        unit: "s",
      };
    } else if (bigintInput >= ms) {
      return {
        value: Number(this.multiply(ms).divide(ms).getBigInt()) / Number(ms),
        unit: "ms",
      };
    } else if (bigintInput >= us) {
      return {
        value: Number(this.multiply(us).divide(us).getBigInt()) / Number(us),
        unit: "μs",
      };
    } else {
      return {
        value: Number(bigintInput),
        unit: "ns",
      };
    }
  }

  public calculateWidthAndOffset(
    startTimestamp: UnixNanoTimeStamp,
    minTimestamp: UnixNanoTimeStamp,
    maxTimestamp: UnixNanoTimeStamp,
  ): {
    width: string;
    offset: string;
  } {
    console.log({
      duration: this.getBigInt(),
      startTimestamp,
      minTimestamp,
      maxTimestamp,
    });

    const timespan = UnixNanoTimeStamp.duration(
      minTimestamp,
      maxTimestamp,
    ).getBigInt();

    const calculatedWidth = this.multiply(percentageMultiplyer)
      .divide(timespan)
      .getBigInt();
    const width = calculatedWidth < 5 ? "5%" : `${calculatedWidth}%`;

    const calculatedOffset = startTimestamp
      .subtract(minTimestamp)
      .multiply(percentageMultiplyer)
      .divide(timespan)
      .getBigInt();
    const offset = calculatedOffset < 0 ? "0%" : `${calculatedOffset}%`;

    return { width, offset };
  }

  public toTimeStamp(): TimeStamp {
    return new TimeStamp(new Date(Number(this.input)));
  }

  public static duration(
    from: UnixNanoTimeStamp,
    to: UnixNanoTimeStamp,
  ): UnixNanoTimeStamp {
    const duration = to.getBigInt() - from.getBigInt();

    return new UnixNanoTimeStamp(duration);
  }

  public static average(times: UnixNanoTimeStamp[]): UnixNanoTimeStamp {
    const sum = times.reduce((a, b) => a + b.getBigInt(), BigInt(0));
    const length = BigInt(times.length);

    const average =
      (sum > 0 ? sum : bigintOne) / (length > 0 ? length : bigintOne);

    return new UnixNanoTimeStamp(average);
  }

  public static earliest(times: UnixNanoTimeStamp[]): UnixNanoTimeStamp {
    return times.reduce((min, c) => (c.input < min.input ? c : min));
  }

  public static latest(times: UnixNanoTimeStamp[]): UnixNanoTimeStamp {
    return times.reduce((max, c) => (c.input > max.input ? c : max));
  }

  public subtract(another: UnixNanoTimeStamp | bigint): UnixNanoTimeStamp {
    const result =
      this.getBigInt() -
      (another instanceof UnixNanoTimeStamp ? another.getBigInt() : another);
    return new UnixNanoTimeStamp(result);
  }

  public divide(divisor: bigint): UnixNanoTimeStamp {
    const result = this.getBigInt() / divisor;
    return new UnixNanoTimeStamp(result);
  }

  public multiply(multiplier: bigint): UnixNanoTimeStamp {
    const result = this.getBigInt() * multiplier;
    return new UnixNanoTimeStamp(result);
  }
}
