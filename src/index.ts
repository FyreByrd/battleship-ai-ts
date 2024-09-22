import BattleshipAI, { Coords, GuessResult, equals, neighbors } from './utils';
import StupidAI from './stupid';
import BasicAI from './basic';

export {
  BattleshipAI,
  Coords,
  GuessResult,
  StupidAI,
  BasicAI,
  equals as coordEquals,
  neighbors as coordNeighbors
};
