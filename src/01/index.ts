import Day from "../day.ts";
import { Response } from "../main.ts";

export default class Day01 implements Day {
  main(data: string): Response {
    const lines: string[] = data.split(/\r?\n/g);
    let outputFirstSolution: number | undefined = undefined;
    let outputSecondSolution: number | undefined = undefined;
    for (const value1 of lines) {
      for (const value2 of lines) {
        if (+value1 + +value2 === 2020) outputFirstSolution = +value1 * +value2;

        if (outputSecondSolution !== undefined) continue;
        if (outputFirstSolution !== undefined) break;
        for (const value3 of lines) {
          if (+value1 + +value2 + +value3 === 2020) {
            outputSecondSolution = +value1 * +value2 * +value3;
            break;
          }
        }
      }
      if (outputFirstSolution !== undefined) break;
    }
    return [
      {
        message: "Entries that sum up to 2020 multiplied",
        value: outputFirstSolution!.toString(),
      },
      {
        message: "Three entries that sum up to 2020 multiplied",
        value: outputSecondSolution!.toString(),
      },
    ];
  }
}
