import Day from "./day.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

export interface Log {
  message: string;
  value: string;
}
export type Response = Array<Log> | undefined;
export class Solution {
  private _day: string;

  constructor(day: number) {
    this._day = day.toString();
    if (day <= 9) this._day = `0${this._day}`;
  }

  async readValues(): Promise<void> {
    Deno.chdir(`./src/${this._day}`);
    if (!existsSync("./index.ts")) {
      console.error(`Day ${this._day} is not solved`);
      return;
    }
    const execute: any = await import(`./${this._day}/index.ts`);
    const file: string = await Deno.readTextFile(`./values.txt`);
    const day: Day = new execute.default();
    const response: Response = day.main(file);
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

for (const arg of Deno.args) {
  if (!isNaN(+arg)) await new Solution(+arg).readValues();
  else console.error(`Parameter ${arg} is not a number`);
}
