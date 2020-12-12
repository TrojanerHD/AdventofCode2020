import Day from '../day.ts';
import { Response } from '../main.ts';
import SpaceObject from './Ship.ts';

export default class Day12 implements Day {
  main(data: string): Response {
    const instructions: string[] = data.split(/\r?\n/g);
    const ship: SpaceObject = new SpaceObject();
    const waypointShip = new SpaceObject();
    const waypoint = new SpaceObject(waypointShip);
    for (const instruction of instructions) {
      const type: string = instruction.substring(0, 1);
      const units: number = Number(
        instruction.substring(1, instruction.split('').length)
      );
      ship.input(type, units);
      waypoint.input(type, units);
    }


    return [
      {
        message: 'The Manhattan distance from the starting point is',
        value: ship.getManhattanDistance(),
      },
      {message: 'The Manhattan distance from the starting point with the waypoint is', value: waypoint.getShip()!.getManhattanDistance()}
    ];
  }
}
