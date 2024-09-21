import BattleshipAI, { randInt } from './utils';
import { Coords, GuessResult } from './utils';

/**
 * AI that guesses a random coordinate
 */
export default class StupidAI implements BattleshipAI {
  guesses: Coords[];

  constructor() {
    this.guesses = [];
    this.reset();
  }

  reset() {
    this.guesses = [];
    for (let i = 1; i <= 10; i++) for (let j = 1; j <= 10; j++) this.guesses.push({ x: i, y: j });
  }

  guess(getResult: (coords: Coords) => GuessResult): GuessResult {
    const i = randInt(0, this.guesses.length - 1);
    const r = getResult(this.guesses[i]);
    if (this.guesses.length < 1) {
      throw new Error('AI out of guesses!');
    }
    this.guesses.slice(i, 1);
    return r;
  }
}
