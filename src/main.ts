import Day from './day.ts';
import { existsSync } from 'https://deno.land/std/fs/mod.ts';

export interface Log {
  message: string;
  value: number;
}
export type Response = Log[];

export class Solution {
  private _day: string;

  constructor(day: number) {
    this._day = day.toString();
    if (day <= 9) this._day = `0${this._day}`;
  }

  async readValues(): Promise<void> {
    Deno.chdir(`./src/${this._day}`);
    if (!existsSync('./index.ts')) {
      console.error(`Day ${this._day} is not solved`);
      return;
    }
    const execute: any = await import(`./${this._day}/index.ts`);
    const file: string = Deno.readTextFileSync(`./values.txt`);
    const day: Day = new execute.default();
    const timeStart: number = performance.now();
    const response: Response = day.main(file.trim());
    const timeEnd: number = performance.now();
    Deno.chdir('../../');
    for (let i = 0; i < response.length; i++) {
      const log: Log = response[i];
      this.logger(i + 1, log.message, log.value);
    }
    console.log(`It took ${timeEnd - timeStart}ms to solve day ${this._day}`);
  }

  private logger(part: number, message: string, value: number) {
    console.log(
      `[Year 2020, Day ${this._day}, Part: ${part}] ${message}: ${value}`
    );
  }
}

for (const arg of Deno.args) {
  if (!isNaN(+arg)) await new Solution(+arg).readValues();
  else console.error(`Parameter ${arg} is not a number`);
}
