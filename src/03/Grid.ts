export type Pixel = "tree" | "air";
export interface PixelPos {
  x: number;
  y: number;
  type: Pixel;
}

export default class Grid {
  private _pixels: PixelPos[] = [];
  private _highestX = 0;
  _highestY = 0;

  addPixel(x: number, y: number, pixelType: Pixel): void {
    if (x > this._highestX) this._highestX = x;
    if (y > this._highestY) this._highestY = y;
    this._pixels.push({ x, y, type: pixelType });
  }

  repeatGrid(x: number): number {
    while (x > this._highestX) x -= this._highestX;
    return x;
  }

  getPixel(x: number, y: number): Pixel {
    x = this.repeatGrid(x);
    const pixel: PixelPos | undefined = this._pixels.find(
      (pixel: PixelPos) => pixel.x === x && pixel.y === y
    );
    if (!pixel) throw new Error(`Pixel at x: ${x}, y: ${y} not found`);
    return pixel.type;
  }
}
