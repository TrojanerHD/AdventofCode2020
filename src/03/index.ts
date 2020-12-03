import Day from "../day.ts";
import { Response } from "../main.ts";
import Grid, { Pixel } from "./Grid.ts";

export default class Day03 implements Day {
  private _grid: Grid = new Grid();

  main(data: string): Response {
    const rows: string[] = data.split(/\r?\n/g);
    for (let i = 0; i < rows.length; i++) {
      const row: string = rows[i];
      const pixels: string[] = row.split("");
      for (let j = 0; j < pixels.length; j++) {
        const pixelSymbol: string = pixels[j];
        let pixel: Pixel = "air";
        if (pixelSymbol === "#") pixel = "tree";
        this._grid.addPixel(j + 1, i + 1, pixel);
      }
    }
    let x: number = 1;
    let treeCountFirstResult: number = this.countTrees(3, 1);
    let treeCountAllCombosMultiplied: number = treeCountFirstResult;
    treeCountAllCombosMultiplied *= this.countTrees(5, 1);
    treeCountAllCombosMultiplied *= this.countTrees(7, 1);
    treeCountAllCombosMultiplied *= this.countTrees(1, 2);
    treeCountAllCombosMultiplied *= this.countTrees(1, 1);

    return [
      {
        message: "Number of trees encountered",
        value: treeCountFirstResult.toString(),
      },
      {
        message: "Multiplied number of trees encountered in all slopes",
        value: treeCountAllCombosMultiplied.toString()
      }
    ];
  }

  private countTrees(xIncrement: number, yIncrement: number): number {
    let x: number = 1;
    let treeCount: number = 0;
    for (let y: number = 1; y <= this._grid._highestY; y += yIncrement) {
      if (this._grid.getPixel(x, y) === "tree") treeCount++;
      x += xIncrement;
    }
    return treeCount;
  }
}
