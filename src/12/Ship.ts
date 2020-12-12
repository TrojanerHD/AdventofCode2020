import { toFileUrl } from 'https://deno.land/std@0.80.0/path/win32.ts';

export enum Direction {
  East = 'E',
  North = 'N',
  South = 'S',
  West = 'W',
}

export default class SpaceObject {
  private _direction: number = 90;
  private _x = 0;
  private _y = 0;
  private _ship: SpaceObject | undefined;

  constructor(ship?: SpaceObject) {
    if (ship) {
      this._ship = ship;
      this._x = 10;
      this._y = -1;
    }
  }

  input(type: string, units: number): void {
    switch (type) {
      case 'N':
        this._y -= units;
        break;
      case 'E':
        this._x += units;
        break;
      case 'S':
        this._y += units;
        break;
      case 'W':
        this._x -= units;
        break;
      case 'F':
        if (this._ship) {
          const distanceX = this._x - this._ship._x;
          const distanceY = this._y - this._ship._y;
          for (; units > 0; units--) {
            this._ship._x = this._x;
            this._ship._y = this._y;
            this._x += distanceX;
            this._y += distanceY;
          }
          break;
        }
        switch (this._direction) {
          case 0:
            this._y -= units;
            break;
          case 90:
            this._x += units;
            break;
          case 180:
            this._y += units;
            break;
          case 270:
            this._x -= units;
            break;
        }
        break;
      case 'R':
        if (this._ship) this.rotateAroundShip(units);
        else this.addDirection(units);
        break;
      case 'L':
        if (this._ship) this.rotateAroundShip(-units);
        this.addDirection(-units);
        break;
    }
  }

  private addDirection(units: number): void {
    this._direction += units;
    while (this._direction >= 360) this._direction -= 360;
    while (this._direction < 0) this._direction += 360;
  }

  private rotateAroundShip(units: number): void {
    if (!this._ship) return;
    while (units !== 0) {
      this._x -= this._ship._x;
      this._y -= this._ship._y;
      const oldX = this._x;
      const oldY = this._y;
      if (units > 0) {
        this._x = -this._y;
        this._y = oldX;
        units -= 90;
      this.addDirection(-90);
      } else {
        this._y = -this._x;
        this._x = oldY;
        units += 90;
      this.addDirection(90);
      }
      this._x += this._ship._x;
      this._y += this._ship._y;
    }
  }

  getManhattanDistance(): number {
    return Math.abs(this._x) + Math.abs(this._y);
  }

  getShip(): SpaceObject | undefined {
    return this._ship;
  }
}
