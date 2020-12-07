import Day from "../day.ts";
import { Response } from "../main.ts";
import Bag from "./Bag.ts";

export default class Day07 implements Day {
  static _bags: Bag[] = [];

  main(data: string): Response {
    const bagsData: string[] = data.split(/\r?\n/g);
    for (const bag of bagsData) {
      const bagSplit: string[] = bag.split(" bags contain ");
      const subBags: Bag[] = [];
      for (const subBag of bagSplit[1].split(", ")) {
        if (subBag === "no other bags.") continue;
        const color: string = subBag
          .replace(/^\d+ /, "")
          .replace(/ bag(s|)(.|)$/, "");
        const subBagCount: number = Number(subBag.split(" ")[0]);
        subBags.push(new Bag(color, [], subBagCount));
      }
      Day07._bags.push(new Bag(bagSplit[0], subBags));
    }

    let containSubBags: number = 0;
    for (const bag of Day07._bags) if (bag.containsShinyBag()) containSubBags++;
    let totalBags: number;
    const shinyBag: Bag | undefined = Day07._bags.find(
      (bag: Bag) => bag._color === "shiny gold"
    );
    if (!shinyBag) totalBags = -1;
    else totalBags = shinyBag.countSubBags(shinyBag.getCount());
    return [
      {
        message: "The total number of all bags that can contain the shiny bag",
        value: containSubBags.toString(),
      },
      {
        message: "The total number of bags the shiny bag has to include",
        value: totalBags.toString(),
      },
    ];
  }
}
