import Day from '../day.ts';
import { Response } from '../main.ts';

export default class Day09 implements Day {
  private _numbersLowerFoundNumber: number[] = [];
  main(data: string): Response {
    const numbers: number[] = [];
    for (const numberString of data.split(/\r?\n/g))
      numbers.push(Number(numberString));

    let numberPartOne: number = -1;
    let lowNumberPartTwo: number = -1;
    let highNumberPartTwo: number = -1;
    for (let i: number = 25; i < numbers.length; i++) {
      const number = numbers[i];
      let numberFound: boolean = false;
      for (let j: number = i - 25; j < i; j++) {
        const previousNumber: number = numbers[j];
        const first25Numbers: number[] = numbers.filter(
          (_value: number, index: number) =>
            index < i && index >= i - 25 && index !== j
        );
        if (
          first25Numbers.find(
            (searchNumber: number) => searchNumber + previousNumber === number
          )
        ) {
          numberFound = true;
          break;
        }
      }
      if (!numberFound) {
        numberPartOne = number;
        this._numbersLowerFoundNumber = numbers.filter(
          (value: number) => value < number
        );

        const numberArray: number[] | undefined = this.findIndeces(number);
        if (numberArray === undefined) break;
        numberArray.sort((a: number, b: number) => (a > b ? 1 : -1));

        lowNumberPartTwo = numberArray[0];
        highNumberPartTwo = numberArray[numberArray.length - 1];

        break;
      }
    }
    return [
      {
        message:
          'The first number where there are no two numbers among the previous 25 numbers that sum up to the number',
        value: numberPartOne,
      },
      {
        message:
          'The low number and the highest number of the set of numbers that sum up to the invalid number',
        value: lowNumberPartTwo + highNumberPartTwo,
      },
    ];
  }

  private findIndeces(searchNumber: number): number[] | undefined {
    let addNumbers: number[] = [];
    for (let i: number = 0; i < this._numbersLowerFoundNumber.length; i++) {
      addNumbers.push(this._numbersLowerFoundNumber[i]);
      for (
        let j = i + 1;
        j < this._numbersLowerFoundNumber.length && j <= searchNumber;
        j++
      ) {
        addNumbers.push(this._numbersLowerFoundNumber[j]);
        let allNumbersAdded: number = 0;
        for (const number of addNumbers) allNumbersAdded += number;
        if (allNumbersAdded === searchNumber) return addNumbers;
      }
      addNumbers = [];
    }
  }
}
