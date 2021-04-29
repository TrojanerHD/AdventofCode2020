import Day from '../day.ts';
import { Response } from '../main.ts';

type Timestamp = number | 'x';

export interface BusTimestamp {
  start: Timestamp;
  current: Timestamp;
}

export default class Day13 implements Day {
  private _busTimestamps: BusTimestamp[] = [];
  private _workerCount = 0;
  private _workers: Worker[] = [];
  private _workerValues: { i: number; count: number }[] = [];

  main(data: string): Response {
    const lines: string[] = data.split(/\r?\n/g);
    const myTimestamp = Number(lines[0]);
    for (const timestamp of lines[1].split(',')) {
      if (timestamp === 'x') continue;
      this._busTimestamps.push({
        start: Number(timestamp),
        current: Number(timestamp),
      });
    }

    this.countUp(myTimestamp);

    let rightBusTimestamp: BusTimestamp = {
      start: Infinity,
      current: Infinity,
    };
    for (const busTimestamp of this._busTimestamps)
      if (busTimestamp.current < rightBusTimestamp.current)
        rightBusTimestamp = busTimestamp;
    if (rightBusTimestamp.current === 'x' || rightBusTimestamp.start === 'x')
      throw new Error('Right bus timestamp has no timestamp lol (part 1)');

    const waitTime: number = rightBusTimestamp.current - myTimestamp;

    this._busTimestamps = [];
    for (const timestamp of lines[1].split(',')) {
      const parsedTimestamp: Timestamp =
        timestamp === 'x' ? timestamp : Number(timestamp);
      this._busTimestamps.push({
        start: parsedTimestamp,
        current: parsedTimestamp,
      });
    }
    const partTwo: number = this.partTwo();
    return [
      {
        message: 'Number of minutes multiplied with bus id',
        value: waitTime * rightBusTimestamp.start,
      },
      {
        message: 'First time the busses depart in a row',
        value: partTwo,
      },
    ];
  }

  private partTwo(): number {
    let largestTimestampPosition = 0;
    const timestamps: {timestamp: number, offset: number}[] = [];
    for (let i = 0; i < this._busTimestamps.length; i++) {
      const timestamp: Timestamp = this._busTimestamps[i].start;
      if (timestamp === 'x') continue;
      timestamps.push({timestamp, offset: i});
    }
    timestamps.sort((a: {timestamp: number, offset: number}, b: {timestamp: number, offset: number}) => a.timestamp < b.timestamp ? 1 : -1);
    for (let i = 1; i < this._busTimestamps.length; i++) {
      const timestamp: Timestamp = this._busTimestamps[i].start;
      if (timestamp !== 'x' && timestamp > this._busTimestamps[largestTimestampPosition].start) largestTimestampPosition = i;
    }
    let i = 0;
    const largestTimestamp: Timestamp = this._busTimestamps[largestTimestampPosition].start;
    if (largestTimestamp === 'x') return 0;
    while (!this.recursivePartTwo(0, i - largestTimestampPosition, timestamps)) i += largestTimestamp;
    return i - largestTimestampPosition;
  }

  private recursivePartTwo(i: number, init: number, timestamps: {timestamp: number, offset: number}[]): boolean {
    if (i >= timestamps.length) return true;
    const timestamp = timestamps[i];
    if ((timestamp.offset + init) % timestamp.timestamp === 0) return this.recursivePartTwo(i + 1, init, timestamps);
    return false;
  }

  private countUp(minNumber: number): number {
    if (minNumber <= 0) return minNumber;
    let minCount = Infinity;
    for (const busTimestamp of this._busTimestamps) {
      let count: number = minNumber;
      if (busTimestamp.current === 'x' || busTimestamp.start === 'x') continue;
      while (count % busTimestamp.start !== 0) count++;
      busTimestamp.current = count;
      if (count < minCount) minCount = count;
    }
    return minCount;
  }
}
