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

export function neighbors(c: Coords): (Coords | null)[] {
  return [
    c.y > 1 ? { x: c.x, y: c.y - 1 } : null,  // north
    c.x < 10 ? { x: c.x + 1, y: c.y } : null, // east
    c.y < 10 ? { x: c.x, y: c.y + 1 } : null, // south
    c.x > 1 ? { x: c.x - 1, y: c.y } : null   // west
  ];
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
