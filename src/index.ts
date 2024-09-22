import BattleshipAI, { Coords, GuessResult, equals, neighbors, i2coords, coords2i } from './utils';
import StupidAI from './stupid';
import BasicAI from './basic';

export {
  BattleshipAI,
  Coords,
  GuessResult,
  StupidAI,
  BasicAI,
  equals as coordEquals,
  neighbors as coordNeighbors,
  i2coords,
  coords2i
};
