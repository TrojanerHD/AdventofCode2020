import { Response } from "../main.ts";

export function main(data: string): Response {
  const passwords: string[] = data.split("\n");
  let matchCountFirstPart: number = 0;
  let matchCountSecondPart: number = 0;

  for (const password of passwords) {
    const passwordSplit: string[] = password.split(": ");
    const passwordPolicy: string[] = passwordSplit[0].split(" ");
    const letterCount: string = passwordPolicy[0];
    const min: string = letterCount.split("-")[0];
    const max: string = letterCount.split("-")[1];
    const letter: string = passwordPolicy[1];
    const potentialPassword: string = passwordSplit[1];
    const regex = `^([^${letter}]*${letter}[^${letter}]*){${min},${max}}$`;
    if (potentialPassword.match(new RegExp(regex))) matchCountFirstPart++;
    const potentialPasswordChars = potentialPassword.split("");
    const firstMatches: boolean = potentialPasswordChars[+min - 1] === letter;
    const lastMatches: boolean = potentialPasswordChars[+max - 1] === letter;

    if ((firstMatches && !lastMatches) || (!firstMatches && lastMatches))
      matchCountSecondPart++;
  }
  return [
    {
      message: "Number of matching passwords with first rule",
      value: matchCountFirstPart.toString(),
    },
    {
      message: "Number of matching passwords with second rule",
      value: matchCountSecondPart.toString(),
    },
  ];
}
