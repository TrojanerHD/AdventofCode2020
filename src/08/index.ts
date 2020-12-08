import Day from '../day.ts';
import { Response } from '../main.ts';
import BootCode, { Instruction } from './BootCode.ts';

export default class Day08 implements Day {
  private _bootCode: BootCode | undefined;
  main(data: string): Response {
    const instructionsStringArray: string[] = data.split(/\r?\n/g);
    const instructions: Instruction[] = [];
    for (const instructionsString of instructionsStringArray) {
      const instructionsStringSplit: string[] = instructionsString.split(' ');
      instructions.push({
        instruction: instructionsStringSplit[0],
        argument: Number(instructionsStringSplit[1]),
      });
    }

    this._bootCode = new BootCode(instructions);
    this.runUntilInfiniteLoop();
    const valueFirstPart: number = this._bootCode.getValue();

    this._bootCode = new BootCode(instructions);
    const replacedInstructions: number[] = [];
    while (!this._bootCode.getDone()) {
      for (let i = instructions.length - 1; i >= 0; i--) {
        const currentInstruction: Instruction = instructions[i];
        if (!replacedInstructions.includes(i)) {
          let skip: boolean = false;
          let replacedNop: boolean = false;
          switch (currentInstruction.instruction) {
            case 'nop':
              currentInstruction.instruction = 'jmp';
              replacedNop = true;
              break;
            case 'jmp':
              currentInstruction.instruction = 'nop';
              break;
            default:
              skip = true;
              break;
          }
          replacedInstructions.push(i);
          if (skip) continue;
          this._bootCode = new BootCode(instructions);
          this.runUntilInfiniteLoop();
          instructions[i].instruction = replacedNop ? 'nop' : 'jmp';
          break;
        }
      }
    }
    return [
      { message: 'Value before loop', value: valueFirstPart.toString() },
      {
        message:
          'Value after one instruction was changed so the program could end',
        value: this._bootCode.getValue().toString(),
      },
    ];
  }

  runUntilInfiniteLoop(): void {
    if (!this._bootCode)
      throw new Error('runInfinteLoop called before initializing bootCode');
    const usedInstructions: number[] = [];
    while (
      !usedInstructions.includes(this._bootCode.getCurrentInstruction()) &&
      !this._bootCode.getDone()
    ) {
      usedInstructions.push(this._bootCode.getCurrentInstruction());
      this._bootCode.nextInstruction();
    }
  }
}
