import { Response } from "./main.ts";

export default interface Day {
  main(data: string): Response;
}
