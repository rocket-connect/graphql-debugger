import { TimeStamp } from "./timestamp";

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
    const ms = Number(BigInt(this.getBigInt()) / BigInt(1000000));

    return ms;
  }

  public calculateWidthAndOffset(
    minTimestamp: UnixNanoTimeStamp,
    maxTimestamp: UnixNanoTimeStamp,
  ): {
    width: string;
    offset: string;
  } {
    const diffMs = Number(
      maxTimestamp.subtract(minTimestamp).divide(BigInt(1000000)),
    );

    const startTimeMs = Number(
      this.subtract(minTimestamp).divide(BigInt(1000000)),
    );

    const calculatedWidth = (startTimeMs / diffMs) * 100;
    const width = calculatedWidth < 5 ? "5%" : `${calculatedWidth}%`;

    const calculatedOffset = (startTimeMs / diffMs) * 100;
    const offset = calculatedOffset < 0 ? "0%" : `${calculatedOffset}%`;

    return { width, offset };
  }

  public toTimeStamp(): TimeStamp {
    const ms = this.toMS();

    return new TimeStamp(new Date(ms));
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
    const lengthBigInt = BigInt(times.length);
    const bigintOne = BigInt(1);
    const average =
      (sum > 0 ? sum : bigintOne) /
      (lengthBigInt > 0 ? lengthBigInt : bigintOne);

    return new UnixNanoTimeStamp(average);
  }

  public static earliest(times: UnixNanoTimeStamp[]): UnixNanoTimeStamp {
    let minTimestamp = times[0];
    for (const timestamp of times) {
      if (timestamp.getBigInt() < minTimestamp.getBigInt()) {
        minTimestamp = timestamp;
      }
    }
    return minTimestamp;
  }

  public static latest(times: UnixNanoTimeStamp[]): UnixNanoTimeStamp {
    let maxTimestamp = times[0];
    for (const timestamp of times) {
      if (timestamp.getBigInt() > maxTimestamp.getBigInt()) {
        maxTimestamp = timestamp;
      }
    }
    return maxTimestamp;
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
}
