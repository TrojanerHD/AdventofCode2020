import Day from '../day.ts';
import { Response } from '../main.ts';
type PassportKey =
  | 'byr'
  | 'iyr'
  | 'eyr'
  | 'hgt'
  | 'hcl'
  | 'ecl'
  | 'pid'
  | 'cid';
interface Passport {
  byr: string;
  iyr: string;
  eyr: string;
  hgt: string;
  hcl: string;
  ecl: string;
  pid: string;
  cid?: string;
}

export default class Day04 implements Day {
  main(data: string): Response {
    const passports: Passport[] = [];
    const passportKeys: PassportKey[] = [
      'byr',
      'ecl',
      'eyr',
      'hcl',
      'hgt',
      'iyr',
      'pid',
    ];
    const lines: string[] = data.split(/\r?\n/g);
    let tempPassport: Passport = this.initPassport();
    for (const line of lines) {
      if (line === '') {
        passports.push(tempPassport);
        tempPassport = this.initPassport();
        continue;
      }
      if (line.match(/ /)) {
        for (const entry of line.split(' ')) {
          const key: string = entry.split(':')[0];
          const value: string = entry.split(':')[1];
          tempPassport[<PassportKey>key] = value;
        }
        continue;
      }
      const key: string = line.split(':')[0];
      const value: string = line.split(':')[1];
      tempPassport[<PassportKey>key] = value;
    }
    passports.push(tempPassport);
    let numberOfValidPassports: number = 0;
    let numberOfValidPassportsPartTwo: number = 0;
    for (const passport of passports) {
      let valid: boolean = true;
      let validPartTwo: boolean = true;
      for (const passportKey of passportKeys) {
        let passportData: string | undefined = passport[passportKey];
        if (!passportData) {
          valid = false;
          validPartTwo = false;
          continue;
        }
        switch (passportKey) {
          case 'byr':
            if (+passportData < 1920 || +passportData > 2002)
              validPartTwo = false;
            break;
          case 'iyr':
            if (+passportData < 2010 || +passportData > 2020)
              validPartTwo = false;
            break;
          case 'eyr':
            if (+passportData < 2020 || +passportData > 2030)
              validPartTwo = false;
            break;
          case 'hgt':
            if (passportData.endsWith('cm')) {
              passportData = passportData.replace('cm', '');
              if (+passportData < 150 || +passportData > 193)
                validPartTwo = false;
            } else {
              passportData = passportData.replace('in', '');
              if (+passportData < 59 || +passportData > 76)
                validPartTwo = false;
            }
            break;
          case 'hcl':
            if (!passportData.match(/^#([0-9a-f]){6}$/)) validPartTwo = false;
            break;
          case 'ecl':
            const validArray: string[] = [
              'amb',
              'blu',
              'brn',
              'gry',
              'grn',
              'hzl',
              'oth',
            ];
            if (!validArray.includes(passportData)) validPartTwo = false;
            break;
          case 'pid':
            if (isNaN(+passportData) || passportData.length !== 9)
              validPartTwo = false;
            break;
        }
      }
      if (valid) numberOfValidPassports++;
      if (validPartTwo) numberOfValidPassportsPartTwo++;
    }
    return [
      {
        message: 'Number of valid passports without restrictions',
        value: numberOfValidPassports,
      },
      {
        message: 'Number of valid passports with restrictions',
        value: numberOfValidPassportsPartTwo,
      },
    ];
  }

  initPassport(): Passport {
    return {
      byr: '',
      iyr: '',
      eyr: '',
      hgt: '',
      hcl: '',
      ecl: '',
      pid: '',
    };
  }
}
