export enum GuessResult {
  Miss = 0,
  Hit,
  Sunk,
  Gameover
}

/**
 * A pair of two numbers between 1 and 10 inclusive
 */
export type Coords = {
  x: number;
  y: number;
};

export function neighbors(c: Coords): Coords[] {
  const ret = [];
  if (c.x > 1) ret.push({ x: c.x - 1, y: c.y });
  if (c.x < 10) ret.push({ x: c.x + 1, y: c.y });
  if (c.y > 1) ret.push({ x: c.x, y: c.y - 1 });
  if (c.y < 10) ret.push({ x: c.x, y: c.y + 1 });

  return ret;
}

export function equals(a: Coords, b: Coords): boolean {
  return a.x === b.x && a.y === b.y;
}

export default interface BattleshipAI {
  /**
   * resets the AI
   */
  reset: () => void;
  /**
   *
   * @param getResult a callback function that takes coordinates and returns a guess result
   * @returns result of guess
   */
  guess: (getResult: (coords: Coords) => GuessResult) => GuessResult;
}

export function randInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
