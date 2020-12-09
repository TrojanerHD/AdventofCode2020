import Day from '../day.ts';
import { Response } from '../main.ts';
export default class Day05 implements Day {
  main(data: string): Response {
    const boardingPasses = data.split(/\r?\n/g);
    const seatIDs: number[] = [];
    for (const boardingPass of boardingPasses) {
      const letters: string[] = boardingPass.split('');
      let minRow: number = 0;
      let maxRow: number = 127;
      let minColumn: number = 0;
      let maxColumn: number = 7;
      for (const letter of letters)
        switch (letter) {
          case 'F':
            maxRow = Math.floor((minRow + maxRow) / 2);
            break;
          case 'B':
            minRow = Math.ceil((minRow + maxRow) / 2);
            break;
          case 'L':
            maxColumn = Math.floor((minColumn + maxColumn) / 2);
            break;
          case 'R':
            minColumn = Math.ceil((minColumn + maxColumn) / 2);
            break;
        }
      seatIDs.push(minRow * 8 + minColumn);
    }
    seatIDs.sort((a: number, b: number): number => (a > b ? 1 : -1));
    const lowestSeat: number = seatIDs[0];
    const highestSeat: number = seatIDs[seatIDs.length - 1];
    let mySeat: number = -1;
    for (let i: number = lowestSeat; i < highestSeat; i++)
      if (!seatIDs.includes(i)) {
        mySeat = i;
        break;
      }

    return [
      { message: 'The highest seat id is', value: highestSeat },
      { message: 'My seat id', value: mySeat },
    ];
  }
}
