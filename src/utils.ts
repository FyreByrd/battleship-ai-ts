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
