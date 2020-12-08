export interface Instruction {
  instruction: string;
  argument: number;
}

export default class BootCode {
  private _value: number = 0;
  private _instructionSet: Instruction[];
  private _currentInstruction: number = 0;
  private _done: boolean = false;

  constructor(instructionSet: Instruction[]) {
    this._instructionSet = instructionSet;
  }

  getCurrentInstruction(): number {
    return this._currentInstruction;
  }

  getValue(): number {
    return this._value;
  }

  getDone(): boolean {
    return this._done;
  }

  nextInstruction(): void {
    if (this._done) return;
    const instruction: Instruction = this._instructionSet[
      this._currentInstruction
    ];
    switch (instruction.instruction) {
      case 'acc':
        this._value += instruction.argument;
        this._currentInstruction++;
        break;
      case 'jmp':
        this._currentInstruction += instruction.argument;
        break;
      case 'nop':
        this._currentInstruction++;
        break;
    }
    if (this._currentInstruction > this._instructionSet.length - 1)
      this._done = true;
  }
}
