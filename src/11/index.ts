import Day from '../day.ts';
import { Response } from '../main.ts';
import { arraysEqual } from '../common.ts';

export enum Seat {
  Occupied = '#',
  Empty = 'L',
  Floor = '.',
}

export default class Day11 implements Day {
  main(data: string): Response {
    const seatRows: Seat[][] = [];
    for (const seatRow of data.split(/\r?\n/g))
      seatRows.push(<Seat[]>seatRow.split(''));

    let currentSeatRows: Seat[][] = this.goThroughSeats(seatRows, 1);
    const occupiedSeatsPartOne: number = this.countOccupied(currentSeatRows);

    currentSeatRows = this.goThroughSeats(seatRows, 2);
    const occupiedSeatsPartTwo: number = this.countOccupied(currentSeatRows);

    return [
      {
        message: 'Occupied seats with first rule',
        value: occupiedSeatsPartOne,
      },
      {
        message: 'Occupied seats with second rule',
        value: occupiedSeatsPartTwo,
      },
    ];
  }

  private goThroughSeats(seatRows: Seat[][], part: 1 | 2): Seat[][] {
    let currentSeatRows: Seat[][] = [];
    for (let i: number = 0; i < seatRows.length; i++) {
      currentSeatRows[i] = [];
      for (let j: number = 0; j < seatRows[i].length; j++)
        currentSeatRows[i].push(seatRows[i][j]);
    }
    let lastSeatRows: Seat[][] = [];
    while (!arraysEqual(lastSeatRows, currentSeatRows)) {
      lastSeatRows = [];
      for (let i: number = 0; i < currentSeatRows.length; i++) {
        lastSeatRows[i] = [];
        for (let j: number = 0; j < currentSeatRows[i].length; j++)
          lastSeatRows[i].push(currentSeatRows[i][j]);
      }
      for (let y: number = 0; y < currentSeatRows.length; y++) {
        const seatRow: Seat[] = currentSeatRows[y];
        for (let x: number = 0; x < seatRow.length; x++) {
          let seat = seatRow[x];
          const adjacent: number =
            part === 1
              ? this.countAdjacentSeats(lastSeatRows, x, y)
              : this.countOccupiedInDirections(lastSeatRows, x, y);
          switch (seat) {
            case Seat.Occupied:
              const adjacentPossible: number = part === 1 ? 4 : 5;
              if (adjacent >= adjacentPossible) seatRow[x] = Seat.Empty;
              break;
            case Seat.Empty:
              if (adjacent === 0) seatRow[x] = Seat.Occupied;
              break;
          }
        }
      }
    }
    return currentSeatRows;
  }

  private countAdjacentSeats(
    seatRows: Seat[][],
    seatX: number,
    seatY: number
  ): number {
    let adjacent: number = 0;
    const x: number = seatX;
    const y: number = seatY;
    seatX--;
    seatY--;
    for (; seatY <= y + 1; seatY++) {
      if (seatY < 0 || seatY > seatRows.length - 1) continue;
      for (; seatX <= x + 1; seatX++)
        if (
          seatRows[seatY][seatX] === Seat.Occupied &&
          !(seatX === x && seatY === y)
        )
          adjacent++;
      seatX -= 3;
    }
    return adjacent;
  }

  private countOccupiedInDirections(
    seatRows: Seat[][],
    seatX: number,
    seatY: number
  ): number {
    let occupied: number = 0;
    const x: number = seatX;
    const y: number = seatY;
    //Left and right
    let left: boolean = false;
    let right: boolean = false;
    for (; ; seatX++) {
      if (seatX === x) continue;
      if (seatX === seatRows[y].length) left = true;
      if (!left)
        switch (seatRows[y][seatX]) {
          case Seat.Occupied:
            occupied++;
            left = true;
            break;
          case Seat.Empty:
            left = true;
            break;
        }

      if (x - seatX + x === -1) right = true;
      if (!right)
        switch (seatRows[y][x - seatX + x]) {
          case Seat.Occupied:
            occupied++;
            right = true;
            break;
          case Seat.Empty:
            right = true;
            break;
        }
      if (left && right) break;
    }

    //Top and bottom
    let bottom: boolean = false;
    let top: boolean = false;
    for (; ; seatY++) {
      if (seatY === y) continue;

      if (seatY === seatRows.length) bottom = true;
      if (!bottom)
        switch (seatRows[seatY][x]) {
          case Seat.Occupied:
            occupied++;
            bottom = true;
            break;
          case Seat.Empty:
            bottom = true;
            break;
        }

      if (y - seatY + y === -1) top = true;
      if (!top)
        switch (seatRows[y - seatY + y][x]) {
          case Seat.Occupied:
            occupied++;
            top = true;
            break;
          case Seat.Empty:
            top = true;
            break;
        }
      if (bottom && top) break;
    }

    seatX = x;
    seatY = y;

    let topLeft: boolean = false;
    let bottomRight: boolean = false;

    //Diagonal top left to bottom right
    for (; ; seatX++, seatY++) {
      if (seatX === x && seatY === y) continue;
      if (seatY === seatRows.length || seatX === seatRows[y].length)
        topLeft = true;
      if (!topLeft)
        switch (seatRows[seatY][seatX]) {
          case Seat.Occupied:
            occupied++;
            topLeft = true;
            break;
          case Seat.Empty:
            topLeft = true;
            break;
        }

      if (y - seatY + y === -1 || x - seatX + x === -1) bottomRight = true;
      if (!bottomRight)
        switch (seatRows[y - seatY + y][x - seatX + x]) {
          case Seat.Occupied:
            occupied++;
            bottomRight = true;
            break;
          case Seat.Empty:
            bottomRight = true;
            break;
        }
      if (topLeft && bottomRight) break;
    }

    //Diagonal top right to bottom left
    topLeft = false;
    bottomRight = false;
    seatX = x;
    seatY = y;

    for (; ; seatX--, seatY++) {
      if (seatX === x && seatY === y) continue;
      if (seatY === seatRows.length || seatX === seatRows[y].length)
        topLeft = true;
        if (!topLeft) switch (seatRows[seatY][seatX]) {
          case Seat.Occupied:
            occupied++;
            topLeft = true;
            break;
            case Seat.Empty:
              topLeft = true;
              break;
        }

      if (y - seatY + y === -1 || x - seatX + x === -1) bottomRight = true;
      if (!bottomRight) switch (seatRows[y - seatY + y][x - seatX + x]) {
        case Seat.Occupied:
          occupied++;
          bottomRight = true;
          break;
          case Seat.Empty:
            bottomRight = true;
            break;
      }

      if (topLeft && bottomRight) break;
    }
    return occupied;
  }

  private countOccupied(currentSeatRows: Seat[][]): number {
    let occupiedSeats: number = 0;
    for (const seatRow of currentSeatRows)
      for (const seat of seatRow) if (seat === Seat.Occupied) occupiedSeats++;
    return occupiedSeats;
  }

  private printSeats(seatRows: Seat[][]) {
    for (const seatRow of seatRows) {
      let seatString: string = '';
      for (const seat of seatRow) seatString += seat;
      console.log(seatString);
    }
  }
}
