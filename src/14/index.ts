import Day from '../day.ts';
import { Response } from '../main.ts';

export default class Day14 implements Day {
  private _mem: number[] = [];
  private _memV2: number[] = [];
  private _mask: string[] = [];

  main(data: string): Response {
    for (const line of data.split(/\r?\n/g)) {
      const lineSplit = line.split(/ = /);
      const operation: string = lineSplit[0];
      const value: string = lineSplit[1];
      if (operation === 'mask') this._mask = value.split('');
      else if (operation.startsWith('mem')) {
        const pos: number = Number(operation.split('[')[1].split(']')[0]);
        const val: number = Number(value);
        this.mask(pos, val);
        this.maskV2(pos, val);
      }
    }

    let totalPart1: number = 0;
    for (const value of this._mem) {
      if (value) totalPart1 += value;
    }

    let totalPart2: number = 0;
    for (const value of this._memV2) {
      if (value) totalPart2 += value;
    }

    return [
      {
        message: 'The sum of all values left after applying the stack',
        value: totalPart1,
      },
      {
        message: 'The sum of all values left after applying version 2',
        value: totalPart2,
      },
    ];
  }

  private mask(pos: number, val: number): void {
    let value: string =
      '0'.repeat(this._mask.length - val.toString(2).length) + val.toString(2);
    for (let i: number = 0; i < this._mask.length; i++) {
      const sym: string = this._mask[i];
      if (sym === 'X') continue;
      value = this.replaceChar(value, sym, i);
    }
    this._mem[pos] = parseInt(value, 2);
  }

  /*private maskV2(pos: number, val: number): void {
    let value: string =
      '0'.repeat(this._mask.length - val.toString(2).length) + val.toString(2);
    for (let i: number = 0; i < this._mask.length; i++) {
      const sym: string = this._mask[i];
      if (sym === '1') value = this.replaceChar(value, sym, i);
    }
    const maxRange: number = (this._mask.join('').match(/X/g) || []).length;
    for (let i = 0; i < Math.pow(2, maxRange); i++) {
      let tempValue: string = value;
      let binNum: string[] = i.toString(2).split('');
      while (binNum.length < maxRange) binNum.unshift('0');

      for (let j: number = 0; j < this._mask.length; j++) {
        if (this._mask[j] !== 'X') continue;
        tempValue = this.replaceChar(tempValue, binNum[0], j);
        binNum.shift();
      }
      if (!this._memV2[pos]) this._memV2[pos] = [];
      this._memV2[pos].push(parseInt(tempValue, 2));
    }
  }*/
  private maskV2(pos: number, val: number): void {
    let value: string =
      '0'.repeat(this._mask.length - pos.toString(2).length) + pos.toString(2);
    for (let i: number = 0; i < this._mask.length; i++) {
      const sym: string = this._mask[i];
      if (sym === '1') value = this.replaceChar(value, sym, i);
    }
    const maxRange: number = (this._mask.join('').match(/X/g) || []).length;
    for (let i = 0; i < Math.pow(2, maxRange); i++) {
      let tempValue: string = value;
      let binNum: string[] = i.toString(2).split('');
      while (binNum.length < maxRange) binNum.unshift('0');

      for (let j: number = 0; j < this._mask.length; j++) {
        if (this._mask[j] !== 'X') continue;
        tempValue = this.replaceChar(tempValue, binNum[0], j);
        binNum.shift();
      }
      this._memV2[parseInt(tempValue, 2)] = val;
    }
  }
  //Stolen from https://www.geeksforgeeks.org/how-to-replace-a-character-at-a-particular-index-in-javascript/
  private replaceChar(
    origString: string,
    replaceChar: string,
    index: number
  ): string {
    let firstPart: string = origString.substr(0, index);
    let lastPart: string = origString.substr(index + 1);

    let newString: string = firstPart + replaceChar + lastPart;
    return newString;
  }
}
