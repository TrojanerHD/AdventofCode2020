import Day07 from "./index.ts";

export default class Bag {
  _subBags: Bag[];
  _color: string;
  _count: number = 1;

  constructor(color: string, subBags: Bag[], count?: number) {
    this._color = color;
    this._subBags = subBags;
    if (count) this._count = count;
  }

  getColor(): string {
    return this._color;
  }

  getSubBags(): Bag[] {
    return this._subBags;
  }

  getCount(): number {
    return this._count;
  }

  setSubBags(subBags: Bag[]): void {
    this._subBags = subBags;
  }

  containsShinyBag(): boolean {
    if (this._subBags.find((bag: Bag) => bag._color === "shiny gold"))
      return true;
    for (const subBag of this._subBags) {
      const realSubBag: Bag | undefined = this.realSubBags(subBag);
      if (!realSubBag) continue;
      if (realSubBag.containsShinyBag()) return true;
    }
    return false;
  }

  countSubBags(multiplier: number): number {
    let totalBags = 0;
    if (this.getColor() !== "shiny gold")
      totalBags += this.getCount() * multiplier;
    for (const subBag of this._subBags) {
      const realSubBag: Bag | undefined = this.realSubBags(subBag);
      if (!realSubBag) continue;
      totalBags += realSubBag.countSubBags(multiplier * subBag.getCount());
    }
    return totalBags;
  }

  private realSubBags(subBag: Bag): Bag | undefined {
    return Day07._bags.find((bag: Bag) => bag.getColor() === subBag.getColor());
  }
}
