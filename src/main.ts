export interface Log {
  message: string;
  value: string;
}
export type Response = Array<Log> | undefined;
export class Day {
  private _day: string;

  constructor(day: number) {
    this._day = day.toString();
    if (day <= 9) this._day = `0${this._day}`;
    this.readValues();
  }

  async readValues(): Promise<void> {
    Deno.chdir(`./src/${this._day}`);
    const execute: { main: (data: string) => Response } = await import(
      `./${this._day}/index.ts`
    );
    const file: string = await Deno.readTextFile(`./values.txt`);
    const response: Response = execute.main(file);
    Deno.chdir("../../");
    for (let i = 0; i < response!.length; i++) {
      const log: Log = response![i];
      this.logger(i + 1, log.message, log.value);
    }
  }

  private logger(part: number, message: string, value: string) {
    console.log(
      `[Year 2020, Day ${this._day}, Part: ${part}] ${message}: ${value}`
    );
  }
}

new Day(1);
