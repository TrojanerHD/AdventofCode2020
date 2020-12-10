import Day from '../day.ts';
import { Response } from '../main.ts';

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

    const withoutDifference3Numbers: number[] = this.removeUnnecessary(
      difference3Numbers
    );

    const optimized: number[] = [];
    for (let i: number = 0; i < withoutDifference3Numbers.length; i++) {
      const previous: number = i > 0 ? withoutDifference3Numbers[i - 1] : 0;
      const next: number =
        i < withoutDifference3Numbers.length - 1
          ? withoutDifference3Numbers[i + 1]
          : this._numberArray[this._numberArray.length - 1] + 3;

      const difference = this.differenceToNext(previous, next);
      if (difference <= 3) optimized.push(i);
    }
    this.solve(withoutDifference3Numbers, optimized);

    return [
      {
        message:
          '1-jolt differences multiplied by the number of 3-jolt differences',
        value: solutionPartOne,
      },
      { message: 'Total combinations', value: this._solutions.length + 1 },
    ];
  }

  private differenceToNext(current: number, next: number): number {
    return next - current;
  }

  private removeUnnecessary(array: number[]): number[] {
    let newArray: number[] = new Array(...this._numberArray);
    let tempArray: number[] = [];
    while (!this.arraysEqual(newArray, tempArray)) {
      tempArray = new Array(...newArray);
      newArray = newArray.filter(
        (value: number, index: number) =>
          !(
            array.includes(this._numberArray[index - 1]) &&
            array.includes(value) &&
            array.includes(this._numberArray[index + 1])
          )
      );
    }
    return newArray;
  }

  private solve(
    array: number[],
    array2: number[],
    startIndex: number = 0
  ): void {
    for (let i: number = startIndex; i < array.length; i++) {
      if (!array2.includes(this._numberArray.indexOf(array[i]))) continue;
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
          this.arraysEqual(solution, newArray)
        )
      )
        continue;
      this._solutions.push(newArray);
      this.solve(newArray, array2, i);
    }
  }
  //Stolen from https://stackoverflow.com/a/16436975/9634099
  private arraysEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
