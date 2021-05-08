import Day from '../day.ts';
import { Response } from '../main.ts';

export default class Day16 implements Day {
  main(data: string): Response {
    const fields: string[] = data.split(/\r?\n\r?\n/);
    const rawRules: string[] = fields[0].split(/\r?\n/);
    const ruleNames: string[] = [];
    const rules: string[] = [];
    for (const rawRule of rawRules) {
      const rawRuleSplit: string[] = rawRule.split(': ');
      for (const rule of rawRuleSplit[1].split(' or ')) {
        rules.push(rule);
        ruleNames.push(rawRuleSplit[0]);
      }
    }

    const rawNearbyTickets: string[] = fields[2].split(/\r?\n/);
    rawNearbyTickets.shift();

    let part1: number = 0;
    let wrongTickets: string[] = [];
    let possibleFields: string[][] = [];
    let impossibleFields: string[][] = [];
    for (const rawNearbyTicket of rawNearbyTickets) {
      const rawNearbyTicketSplit: string[] = rawNearbyTicket.split(',');
      for (let i: number = 0; i < rawNearbyTicketSplit.length; i++) {
        const nearbyTicketField: number = Number(rawNearbyTicketSplit[i]);
        let right: boolean = false;
        for (let j: number = 0; j < rules.length; j++) {
          const ruleSplit: string[] = rules[j].split('-');
          if (
            nearbyTicketField >= Number(ruleSplit[0]) &&
            nearbyTicketField <= Number(ruleSplit[1])
          ) {
            right = true;
            break;
          }
        }
        if (!right) {
          if (!wrongTickets.find((value: string) => value === rawNearbyTicket))
            wrongTickets.push(rawNearbyTicket);
          part1 += nearbyTicketField;
        }
      }
    }

    const rightTickets = rawNearbyTickets.filter((value: string) => !wrongTickets.find(((wrongTicket: string) => wrongTicket === value)));

    for (const ticket of rightTickets) {
      const ticketSplit: string[] = ticket.split(',');
      for (let i: number = 0; i < ticketSplit.length; i++) {
        const field: number = Number(ticketSplit[i]);
        for (let j: number = 0; j < rules.length - 1; j += 2) {
          const rule1: string = rules[j];
          const rule1Split: string[] = rule1.split('-');

          const rule2: string = rules[j + 1];
          const rule2Split: string[] = rule2.split('-');

          if (!possibleFields[i]) possibleFields[i] = [];
          if (!impossibleFields[i]) impossibleFields[i] = [];
          if (
            (field >= Number(rule1Split[0]) &&
              field <= Number(rule1Split[1])) ||
            (field >= Number(rule2Split[0]) && field <= Number(rule2Split[1]))
          ) {
            if (!possibleFields[i].includes(ruleNames[j]))
              possibleFields[i].push(ruleNames[j]);
          } else {
            if (!impossibleFields[i].includes(ruleNames[j]))
              impossibleFields[i].push(ruleNames[j]);
          }
        }
      }
    }

    const fieldNames: string[] = [];
    while (fieldNames.filter((value: string) => value !== undefined).length !== possibleFields.length)
      for (let i: number = 0; i < possibleFields.length; i++) {
        if (fieldNames[i]) continue;
        const possibleField: string[] = possibleFields[i].filter(
          (value: string) => !fieldNames.includes(value)
        );
        const impossibleField: string[] = impossibleFields[i].filter(
          (value: string) => !fieldNames.includes(value)
        );
        const filteredArray: string[] = possibleField.filter(
          (value: string) => !impossibleField.includes(value)
        );
        if (filteredArray.length === 1) {
          fieldNames[i] = filteredArray[0];
        }
      }

    let part2: number = 1;
    const yourTicket: string[] = fields[1].split(/\r?\n/)[1].split(',');
    for (let i = 0; i < yourTicket.length; i++) {
      if (fieldNames[i].startsWith('departure')) part2 *= Number(yourTicket[i]);
    }
    return [
      {
        message: 'Wrong nearby ticket fields',
        value: part1,
      },
      {
        message: 'Values multiplied starting with departure',
        value: part2,
      },
    ];
  }
}
