import Day from "../day.ts";
import { Response } from "../main.ts";
import Grid, { Pixel } from "./Grid.ts";

export default class Day03 implements Day {
  main(data: string): Response {
    const rows: string[] = data.split(/\r?\n/g);
    const grid: Grid = new Grid();
    for (let i = 0; i < rows.length; i++) {
      const row: string = rows[i];
      const pixels: string[] = row.split("");
      for (let j = 0; j < pixels.length; j++) {
        const pixelSymbol: string = pixels[j];
        let pixel: Pixel = "air";
        if (pixelSymbol === "#") pixel = "tree";
        grid.addPixel(j + 1, i + 1, pixel);
      }
    }
    let x = 1;
    let treeCount = 0
    for (let y = 1; y <= grid._highestY; y++) {
      if (grid.getPixel(x, y) === 'tree') treeCount++;
      x += 3;
    }
    return [{message: "Number of trees encountered", value: treeCount.toString()}];
  }
}
