import BattleshipAI, { randInt, Coords, GuessResult, neighbors, equals } from './utils';

/**
 * AI that uses a basic 2-stage Hunt/Target algorithm
 */
export default class BasicAI implements BattleshipAI {
  all: Coords[];
  parity: Coords[];
  toTry: number[];

  constructor() {
    this.all = [];
    this.parity = [];
    this.toTry = [];
    this.reset();
  }

  reset() {
    this.all = [];
    this.parity = [];
    this.toTry = [];
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const c: Coords = { x: i, y: j };
        if (i % 2 === j % 2) {
          this.parity.push(c);
        }
        this.all.push(c);
      }
    }
  }

  private getRandomCoord(): Coords {
    if (this.parity.length > 0) {
      const i = randInt(0, this.parity.length - 1);
      const c = this.parity[i];
      this.parity.splice(i, 1);
      this.all = this.all.filter((a) => !equals(a, c));
      return c;
    } else if (this.all.length > 0) {
      const i = randInt(0, this.all.length - 1);
      const c = this.all[i];
      this.all.splice(i, 1);
      return c;
    } else {
      throw new Error('AI ran out of guesses');
    }
  }

  guess(getResult: (coords: Coords) => GuessResult): GuessResult {
    let c: Coords;

    // Target
    if (this.toTry.length > 0) {
      const i = this.toTry.pop()!;
      c = this.all[i];
      this.all.splice(i, 1);
      this.parity = this.parity.filter((p) => !equals(p, c));
    }
    // Hunt
    else {
      c = this.getRandomCoord();
    }

    const r = getResult(c);
    if (r === GuessResult.Hit || r === GuessResult.Sunk) {
      const nCoords = neighbors(c);
      nCoords.forEach((n) => {
        if (n) {
          const i = this.all.findIndex((a) => equals(a, n));
          if (i >= 0 && !this.toTry.includes(i)) {
            this.toTry.push(i);
          }
        }
      });
    }
    return r;
  }
}
