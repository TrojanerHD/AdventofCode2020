import Day from "../day.ts";
import { Response } from "../main.ts";

export default class Day06 implements Day {
  main(data: string): Response {
    const groups: string[] = data.split(/\r?\n\r?\n/g);
    let totalAnswersPartOne: number = 0;
    let totalAnswersPartTwo: number = 0;
    for (const group of groups) {
      const groupToOnePerson: string = group.replace(/\r?\n/g, "");
      const answered: string[] = groupToOnePerson.split("");
      const answeredWithoutDuplicates: string[] = [...new Set(answered)];
      totalAnswersPartOne += answeredWithoutDuplicates.length;

      const people: string[] = group.split(/\r?\n/g);
      let allAnswers: string[] = [];
      if (people.length === 1) allAnswers = people[0].split("");
      else {
        const firstPerson: string[] = people[0].split("");
        const removeAnswer: string[] = [];
        for (const firstAnswer of firstPerson) {
          for (let i = 1; i < people.length; i++) {
            let answers: string[] = people[i].split("");
            if (!answers.includes(firstAnswer)) {
              removeAnswer.push(firstAnswer);
              break;
            }
          }
        }
        allAnswers = firstPerson.filter((value: string): boolean => !removeAnswer.includes(value));
      }
      totalAnswersPartTwo += allAnswers.length;
    }

    return [
      {
        message: "Total questions answered",
        value: totalAnswersPartOne.toString(),
      },
      {
        message: "Total questions answered by all groups",
        value: totalAnswersPartTwo.toString(),
      },
    ];
  }

  //Stolen from https://stackoverflow.com/a/16227294/9634099
  private static intersect(a: string[], b: string[]) {
    let t: string[];
    if (b.length > a.length) (t = b), (b = a), (a = t); // indexOf to loop over shorter
    return a.filter((e: string) => b.indexOf(e) > -1);
  }
}
