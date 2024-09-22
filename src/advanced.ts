import BattleshipAI, { Coords, GuessResult, neighbors, i2coords, coords2i } from './utils';

enum Mode {
  Hunt = 0,
  Target
}

/**
 * AI that uses a Probability Density Function to aid a 2-stage Hunt/Target algorithm
 */
export default class AdvancedAI implements BattleshipAI {
  mode: Mode;
  parity: number[];
  misses: number[];
  unlikely: number[];
  hits: number[];
  sinks: number[];
  guesses: number[];
  cloud: number[];
  max: number;

  constructor() {
    this.mode = Mode.Hunt;
    this.parity = [];
    this.misses = [];
    this.unlikely = [];
    this.hits = [];
    this.sinks = [];
    this.guesses = [];
    this.cloud = [];
    this.max = 0;
    this.reset();
  }

  reset() {
    this.mode = Mode.Hunt;
    this.parity = [];
    this.misses = [];
    this.unlikely = [];
    this.hits = [];
    this.sinks = [];
    this.guesses = [];
    this.cloud = Array.from({ length: 100 }, () => 0);
    this.max = 0;
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        if (i % 2 === j % 2) {
          this.parity.push(1);
        } else {
          this.parity.push(0);
        }
      }
    }
  }

  private impassable(i: number): boolean {
    return (
      this.sinks.includes(i) ||
      (this.mode === Mode.Hunt && this.hits.includes(i)) ||
      this.misses.includes(i) ||
      this.unlikely.includes(i)
    );
  }

  private hit(c: Coords | null): boolean {
    return c === null || this.hits.includes(coords2i(c));
  }

  private analyze() {
    this.unlikely = [];
    //analyze list
    this.hits
      .map((h) => ({ h: h, n: neighbors(i2coords(h)) }))
      .forEach((h) => {
        let hnCount = 0;
        let colinear =
          (this.hit(h.n[0]) && this.hit(h.n[2])) || (this.hit(h.n[1]) && this.hit(h.n[3]));
        h.n.forEach((n, i) => {
          if (this.hit(n)) {
            hnCount++;
            if (n && this.hit(neighbors(n)[i])) {
              colinear = true;
            }
          }
        });
        if (hnCount > 3 || colinear) {
          this.unlikely.push(h.h);
        }
      });
  }

  private buildCloud() {
    const clouds_to_build = [
      [5, 0],
      [5, 1],
      [4, 0],
      [4, 1],
      [3, 0],
      [3, 1],
      [3, 0],
      [3, 1],
      [2, 0],
      [2, 1]
    ];
    //builds a cloud for each ship length and orientation
    const p_output = clouds_to_build.map(([l, d]) => this.cloudHelp(l, d as 0 | 1));
    //sums all the values across the subclouds
    for (let i = 0; i < 100; i++) {
      let sum = 0;
      if (this.impassable(i)) {
        this.cloud[i] = -10;
        continue;
      } else if (this.guesses.includes(i)) {
        this.cloud[i] = -1;
        continue;
      } else if (this.mode === Mode.Hunt) {
        p_output.forEach((p) => {
          sum += p[i] + this.parity[i];
        });
      } else {
        p_output.forEach((p) => {
          sum += p[i];
        });
        sum += this.parity[i];
      }
      if (sum > this.cloud[this.max]) {
        this.max = i;
      }
      this.cloud[i] = sum;
    }
  }

  private cloudHelp(len: number, dir: 0 | 1) {
    const cloud = Array.from({ length: 100 }, () => 0);
    for (let i = 0; i < 100; i++) {
      let available = true;
      const inds: number[] = [];
      let hCount = 0;
      for (let j = i; j < i + len * 10 ** dir; j += 10 ** dir) {
        inds.push(j);
        if (j >= 100) {
          available = false;
          break;
        }
        if (this.mode === Mode.Target) {
          if (this.hits.includes(j) && !this.unlikely.includes(i)) {
            hCount++;
          }
        }
        if (this.impassable(j)) {
          available = false;
        } else if (j % 10 == 9 && j != i + (len - 1) * 10 ** dir) {
          if (j < 99) {
            const k = j + 10 ** dir;
            if (k % 10 == 0) {
              available = false;
            }
          }
        }
      }
      if (available) {
        inds.forEach((j) => {
          cloud[j] += this.mode === Mode.Hunt ? 1 : hCount * 5;
        });
      }
    }
    return cloud;
  }

  guess(getResult: (coords: Coords) => GuessResult): GuessResult {
    if (this.guesses.length >= 100) {
      throw new Error('AI out of guesses!');
    }
    this.buildCloud();
    this.guesses.push(this.max);
    const c: Coords = i2coords(this.max);
    const r = getResult(c);

    if (r === GuessResult.Miss) {
      this.misses.push(this.max);
    } else if (r === GuessResult.Hit) {
      this.mode = Mode.Target;
      this.hits.push(this.max);
    } else if (r === GuessResult.Sunk) {
      this.mode = Mode.Hunt;
      this.hits.push(this.max);
      this.sinks.push(this.max);
      this.analyze();
    }

    // anti-choke heuristic
    if (this.guesses.length > 50 + Math.floor(this.hits.length / 2)) {
      this.unlikely = [];
      this.mode = Mode.Target;
    }
    return r;
  }
}
