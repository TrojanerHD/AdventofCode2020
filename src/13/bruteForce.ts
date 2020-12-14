import Day13, { BusTimestamp } from './index.ts';

export {};

declare let onmessage: (e: MessageEvent<any>) => void;
declare function postMessage(data: any): void;

onmessage = (e: MessageEvent<any>) => {
  const properties: {
    i: number;
    count: number;
    busTimestamps: BusTimestamp[];
  } = JSON.parse(e.data);
  main(properties.i, properties.count, properties.busTimestamps);
};

function main(i: number, count: number, busTimestamps: BusTimestamp[]) {
  const timestamp: BusTimestamp = busTimestamps[i];
  let previousTimestamp: BusTimestamp | undefined;
  let lastValue: number = i - 1;
  for (let j: number = i - 1; j >= 0; j--) {
    if (busTimestamps[j].current === 'x') continue;
    lastValue = j;
    break;
  }
  previousTimestamp = busTimestamps[lastValue];
  while (true) {
    if (
      timestamp.start === 'x' ||
      previousTimestamp.start === 'x' ||
      previousTimestamp.current === 'x'
    ) {
      postMessage(`{"count": ${count}, "i": ${i}}`);
      return;
    }
    if (
      (count - i + lastValue) % previousTimestamp.start === 0 &&
      count % timestamp.start === 0
    ) {
      postMessage(`{"count": ${count}, "i": ${i}}`);
      return;
    }
    count++;
  }
}
