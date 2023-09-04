import moment from "moment";

export class TimeStamp {
  private input: Date;

  constructor(input: Date) {
    this.input = input;
  }

  toStorage(): Date {
    return this.input;
  }

  toString(): string {
    return this.input.toString();
  }

  public get moment(): moment.Moment {
    return moment(this.input);
  }
}
