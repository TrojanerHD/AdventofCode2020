import Day from '../day.ts';
import { Response } from '../main.ts';

export default class Day15 implements Day {
  main(data: string): Response {
    const input: number[] = Array.from(data.split(','), (x: string) =>
      Number(x)
    );

    //val, pos
    const lastInputs: Map<number, number> = new Map();

    for (let i: number = 0; i < input.length - 1; i++)
      lastInputs.set(input[i], i);

    let iterations: number = input.length - 1;
    let lastInput: number = input[input.length - 1];

    let results: number[] = [];

    while (iterations < 30000000) {
      if (iterations === 2019) results.push(lastInput);
      if (iterations === 29999999) results.push(lastInput);
      const previousOccurence: number | undefined = lastInputs.get(lastInput);
      if (!previousOccurence && previousOccurence !== 0) {
        lastInputs.set(lastInput, iterations);
        lastInput = 0;
        iterations++;
        continue;
      }

      lastInputs.set(lastInput, iterations);
      lastInput = iterations - previousOccurence;

      iterations++;
    }

    return [
      {
        message: 'The 2020th number spoken',
        value: results[0],
      },
      {
        message: 'The 30000000th number spoken',
        value: results[1],
      },
    ];
  }
}
