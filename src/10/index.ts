import Day from '../day.ts';
import { Response } from '../main.ts';
import { arraysEqual } from '../common.ts';

export default class Day10 implements Day {
  private _solutions: number[][] = [];
  private _numberArray: number[] = [];

  main(data: string): Response {
    for (const dataSplit of data.split(/\r?\n/g))
      this._numberArray.push(Number(dataSplit));

    this._numberArray.sort((a: number, b: number) => (a > b ? 1 : -1));
    let difference1: number = 0;
    let difference3: number = 1;
    let previous: number = 0;

    const difference3Numbers: number[] = [];

    for (let i: number = 0; i < this._numberArray.length; i++) {
      const current = this._numberArray[i];
      switch (current - previous) {
        case 3:
          difference3++;
          difference3Numbers.push(current);
          break;
        case 1:
          difference1++;
          break;
      }

      previous = current;
    }
    let solutionPartOne: number = difference1 * difference3;

    const calculateArray: number[][] = [];
    let tempCalculate: number[] = [];
    for (let i: number = 0; i < this._numberArray.length; i++) {
      const previous: number = i > 0 ? this._numberArray[i - 1] : 0;
      const next: number =
        i < this._numberArray.length - 1
          ? this._numberArray[i + 1]
          : this._numberArray[this._numberArray.length - 1] + 3;

      const difference = this.differenceToNext(previous, next);
      if (difference <= 3) tempCalculate.push(this._numberArray[i]);
      else if (tempCalculate.length !== 0) {
        tempCalculate.push(this._numberArray[i]);
        const previousFromTempCalculate: number = this._numberArray[
          this._numberArray.indexOf(tempCalculate[0]) - 1
        ];
        if (previousFromTempCalculate)
          tempCalculate.unshift(previousFromTempCalculate);
        calculateArray.push(tempCalculate);
        tempCalculate = [];
      }
    }
    let solutions: number = 1;
    for (const calculate of calculateArray) {
      this._solutions.push(calculate);
      solutions *= this.solve(calculate) + 1;
    }

    return [
      {
        message:
          '1-jolt differences multiplied by the number of 3-jolt differences',
        value: solutionPartOne,
      },
      {
        message: 'Total combinations',
        value: solutions,
      },
    ];
  }

  private differenceToNext(current: number, next: number): number {
    return next - current;
  }

  private solve(array: number[], startIndex: number = 0): number {
    let solutions: number = 0;
    for (let i: number = startIndex; i < array.length; i++) {
      const newArray = array.filter(
        (_value: number, index: number) => i !== index
      );
      const previous: number = i > 0 ? newArray[i - 1] : 0;
      const next: number =
        i < newArray.length
          ? newArray[i]
          : this._numberArray[this._numberArray.length - 1] + 3;
      if (this.differenceToNext(previous, next) > 3) continue;
      if (
        this._solutions.find((solution: number[]) =>
          arraysEqual(solution, newArray)
        )
      )
        continue;
      this._solutions.push(newArray);
      solutions++;
      solutions += this.solve(newArray, i);
    }
    return solutions;
  }
}
