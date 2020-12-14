import Day from '../day.ts';
import { Response } from '../main.ts';

type Timestamp = number | 'x';

export interface BusTimestamp {
  start: Timestamp;
  current: Timestamp;
}

export default class Day13 implements Day {
  private _busTimestamps: BusTimestamp[] = [];
  private _workerCount: number = 0;
  private _workers: Worker[] = [];
  private _workerValues: { i: number; count: number }[] = [];

  main(data: string): Response {
    const lines: string[] = data.split(/\r?\n/g);
    const myTimestamp: number = Number(lines[0]);
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
    this.initWorkers(100000000000000);
    return [
      {
        message: 'Number of minutes multiplied with bus id',
        value: waitTime * rightBusTimestamp.start,
      },
      {
        message: 'First time the busses depart in a row',
        value: this._busTimestamps.length + 1,
      },
    ];
  }

  private countUp(minNumber: number): number {
    if (minNumber <= 0) return minNumber;
    let minCount: number = Infinity;
    for (const busTimestamp of this._busTimestamps) {
      let count: number = minNumber;
      if (busTimestamp.current === 'x' || busTimestamp.start === 'x') continue;
      while (count % busTimestamp.start !== 0) count++;
      busTimestamp.current = count;
      if (count < minCount) minCount = count;
    }
    return minCount;
  }

  private workerMessage(e: MessageEvent<any>): void {
    this._workerCount--;
    const properties: { i: number; count: number } = JSON.parse(e.data);
    this._workerValues.push(properties);
    if (this._workerCount !== 0) return;
    this._workerValues.sort(
      (a: { i: number; count: number }, b: { i: number; count: number }) =>
        a.i > b.i ? 1 : -1
    );
    for (let i: number = 0; i < this._busTimestamps.length; i++) {
      if (this._busTimestamps[i].current === 'x') continue;
      this.countUp(this._workerValues[i].count - 1);
      break;
    }
    let first: BusTimestamp = { current: -1, start: -1 };
    let skip: boolean = false;
    for (let i = 0; i < this._busTimestamps.length; i++) {
      const current: BusTimestamp = this._busTimestamps[i];
      if (current.current === 'x') continue;
      if (first.current === -1) {
        first.current = current.current;
        first.start = current.start;
      }
      if (first.current === 'x') continue;
      if (current.current - first.current !== i) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      console.log(`Found ${first.current}`);
      for (const worker of this._workers) worker.terminate();
    } else {
      for (let i: number = 0; i < this._workers.length; i++) {
        this._workerCount++;
        const worker: Worker = this._workers[i];
        const workerValues: { i: number; count: number } = this._workerValues[
          i
        ];
        if (first.start === 'x')
          throw new Error('first start is x even though it never should');
        workerValues.count += first.start;
        worker.postMessage(
          `{"i": ${workerValues.i}, "count": ${
            workerValues.count
          }, "busTimestamps": ${JSON.stringify(this._busTimestamps)} }`
        );
      }
      this._workerValues = [];
    }
  }

  private initWorkers(count: number): void {
    this._workerCount += this._busTimestamps.length - 1;
    for (let i = 1; i < this._busTimestamps.length; i++) {
      const worker = new Worker(
        new URL('bruteForce.ts', import.meta.url).href,
        { type: 'module', deno: true }
      );
      worker.onmessage = this.workerMessage.bind(this);
      this._workers.push(worker);
      worker.postMessage(
        `{"i": ${i}, "count": ${count}, "busTimestamps": ${JSON.stringify(
          this._busTimestamps
        )}}`
      );
    }
  }

  private bruteForce(i: number, count: number): boolean {
    const timestamp: BusTimestamp = this._busTimestamps[i];
    let previousTimestamp: BusTimestamp | undefined;
    let lastValue: number = i - 1;
    for (let j: number = i - 1; j >= 0; j--) {
      if (this._busTimestamps[j].current === 'x') continue;
      lastValue = j;
      break;
    }
    previousTimestamp = this._busTimestamps[lastValue];
    if (
      timestamp.start === 'x' ||
      previousTimestamp.start === 'x' ||
      previousTimestamp.current === 'x'
    )
      return true;
    if (
      (count - i + lastValue) % previousTimestamp.start === 0 &&
      count % timestamp.start === 0
    ) {
      //this.countUp(count);
      return true;
    }
    return false;
  }
  //Stolen from https://stackoverflow.com/a/31302607/9634099
  private leastCommonMultiple(min: number, max: number) {
    function range(min: number, max: number): number[] {
      const arr: number[] = [];
      for (let i: number = min; i <= max; i++) arr.push(i);

      return arr;
    }

    function gcd(a: number, b: number): number {
      return !b ? a : gcd(b, a % b);
    }

    function lcm(a: number, b: number): number {
      return (a * b) / gcd(a, b);
    }

    let multiple: number = min;
    range(min, max).forEach((n: number): void => {
      multiple = lcm(multiple, n);
    });

    return multiple;
  }
}
