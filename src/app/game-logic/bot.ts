import { SharedUtils } from '../shared/logic/utils';
import { Player } from '../shared/models';
import { Game } from './game';
import { Heuristics } from './heuristics';

export class Bot {
  private static MAX_DEPTH = 4;

  public static move(
    game: Game,
    botType: Player,
    maxDepth = this.MAX_DEPTH,
    heuristic: Heuristics
  ): [number, number] {
    const clonedGame = game.clone();
    const startTimeMs = new Date().getTime();
    const newMove: BotMoveValue = this.maxAction(
      clonedGame,
      maxDepth,
      botType,
      heuristic
    );
    const endTimeMs = new Date().getTime();
    const elapsedTime = endTimeMs - startTimeMs;
    // SharedUtils.logWithoutLineNumber(`${Player[botType]},${elapsedTime},false`);
    return [newMove.binNumber, elapsedTime];
  }

  private static maxAction(
    game: Game,
    currentDepth: number,
    botType: Player,
    heuristic: Heuristics
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MIN_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = this.calcFitness(game, botType, heuristic);
      return newMove;
    }
    let fitnessValue = Number.MIN_SAFE_INTEGER;
    for (
      let binNumber =
        botType === Player.A
          ? game.lastBinNumberForPlayerA
          : game.lastBinNumberForPlayerB;
      binNumber >=
      (botType === Player.A
        ? game.fstBinNumberForPlayerA
        : game.fstBinNumberForPlayerB);
      binNumber--
    ) {
      if (!game.illegalMove(binNumber)) {
        const clonedGame = game.clone();
        const playerBefore = clonedGame.actualPlayer;
        clonedGame.makeMove(binNumber);
        const playerAfter = clonedGame.actualPlayer;
        const extraTurn = playerBefore === playerAfter;
        const fintessValueBefore = fitnessValue;

        if (!extraTurn) {
          fitnessValue = Math.max(
            fitnessValue,
            this.minAction(clonedGame, currentDepth - 1, botType, heuristic)
              .fitnessValue
          );
        } else {
          fitnessValue = Math.max(
            fitnessValue,
            this.maxAction(clonedGame, currentDepth - 1, botType, heuristic)
              .fitnessValue
          );
        }

        if (fintessValueBefore < fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
      }
    }
    return newMove;
  }

  private static minAction(
    game: Game,
    currentDepth: number,
    botType: Player,
    heuristic: Heuristics
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MAX_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = this.calcFitness(game, botType, heuristic);
      return newMove;
    }
    let fitnessValue = Number.MAX_SAFE_INTEGER;
    for (
      let binNumber =
        botType === Player.A
          ? game.lastBinNumberForPlayerB
          : game.lastBinNumberForPlayerA;
      binNumber >=
      (botType === Player.A
        ? game.fstBinNumberForPlayerB
        : game.fstBinNumberForPlayerA);
      binNumber--
    ) {
      if (!game.illegalMove(binNumber)) {
        const clonedGame = game.clone();
        const playerBefore = clonedGame.actualPlayer;
        clonedGame.makeMove(binNumber);
        const playerAfter = clonedGame.actualPlayer;
        const extraTurn = playerBefore === playerAfter;
        const fintessValueBefore = fitnessValue;

        if (!extraTurn) {
          fitnessValue = Math.min(
            fitnessValue,
            this.maxAction(clonedGame, currentDepth - 1, botType, heuristic)
              .fitnessValue
          );
        } else {
          fitnessValue = Math.min(
            fitnessValue,
            this.minAction(clonedGame, currentDepth - 1, botType, heuristic)
              .fitnessValue
          );
        }

        if (fintessValueBefore > fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
      }
    }
    return newMove;
  }

  /* ------------------------------------------- With alpha-beta pruning ------------------------------------------- */
  public static moveWithAlphaBeta(
    game: Game,
    botType: Player,
    maxDepth = this.MAX_DEPTH,
    heuristic: Heuristics
  ): [number, number] {
    const clonedGame = game.clone();
    const startTimeMs = new Date().getTime();
    const newMove: BotMoveValue = this.maxActionAlphaBeta(
      clonedGame,
      maxDepth,
      botType,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      heuristic
    );
    const endTimeMs = new Date().getTime();
    const elapsedTime = endTimeMs - startTimeMs;
    // SharedUtils.logWithoutLineNumber(`${Player[botType]},${elapsedTime},true`);
    return [newMove.binNumber, elapsedTime];
  }

  private static maxActionAlphaBeta(
    game: Game,
    currentDepth: number,
    botType: Player,
    alpha: number,
    beta: number,
    heuristic: Heuristics
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MIN_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = this.calcFitness(game, botType, heuristic);
      return newMove;
    }
    let fitnessValue = Number.MIN_SAFE_INTEGER;
    for (
      let binNumber =
        botType === Player.A
          ? game.lastBinNumberForPlayerA
          : game.lastBinNumberForPlayerB;
      binNumber >=
      (botType === Player.A
        ? game.fstBinNumberForPlayerA
        : game.fstBinNumberForPlayerB);
      binNumber--
    ) {
      if (!game.illegalMove(binNumber)) {
        const clonedGame = game.clone();
        const playerBefore = clonedGame.actualPlayer;
        clonedGame.makeMove(binNumber);
        const playerAfter = clonedGame.actualPlayer;
        const extraTurn = playerBefore === playerAfter;
        const fintessValueBefore = fitnessValue;

        if (!extraTurn) {
          fitnessValue = Math.max(
            fitnessValue,
            this.minActionAlphaBeta(
              clonedGame,
              currentDepth - 1,
              botType,
              alpha,
              beta,
              heuristic
            ).fitnessValue
          );
        } else {
          fitnessValue = Math.max(
            fitnessValue,
            this.maxActionAlphaBeta(
              clonedGame,
              currentDepth - 1,
              botType,
              alpha,
              beta,
              heuristic
            ).fitnessValue
          );
        }

        if (fintessValueBefore < fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
        if (fitnessValue >= beta) {
          return newMove;
        }
        if (fitnessValue > alpha) {
          alpha = fitnessValue;
        }
      }
    }
    return newMove;
  }

  private static minActionAlphaBeta(
    game: Game,
    currentDepth: number,
    botType: Player,
    alpha: number,
    beta: number,
    heuristic: Heuristics
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MAX_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = this.calcFitness(game, botType, heuristic);
      return newMove;
    }
    let fitnessValue = Number.MAX_SAFE_INTEGER;
    for (
      let binNumber =
        botType === Player.A
          ? game.lastBinNumberForPlayerB
          : game.lastBinNumberForPlayerA;
      binNumber >=
      (botType === Player.A
        ? game.fstBinNumberForPlayerB
        : game.fstBinNumberForPlayerA);
      binNumber--
    ) {
      if (!game.illegalMove(binNumber)) {
        const clonedGame = game.clone();
        const playerBefore = clonedGame.actualPlayer;
        clonedGame.makeMove(binNumber);
        const playerAfter = clonedGame.actualPlayer;
        const extraTurn = playerBefore === playerAfter;
        const fintessValueBefore = fitnessValue;

        if (!extraTurn) {
          fitnessValue = Math.min(
            fitnessValue,
            this.maxActionAlphaBeta(
              clonedGame,
              currentDepth - 1,
              botType,
              alpha,
              beta,
              heuristic
            ).fitnessValue
          );
        } else {
          fitnessValue = Math.min(
            fitnessValue,
            this.minActionAlphaBeta(
              clonedGame,
              currentDepth - 1,
              botType,
              alpha,
              beta,
              heuristic
            ).fitnessValue
          );
        }

        if (fintessValueBefore > fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
        if (fitnessValue <= alpha) {
          return newMove;
        }
        if (fitnessValue < beta) {
          beta = fitnessValue;
        }
      }
    }
    return newMove;
  }

  public static calcFitness(
    game: Game,
    botType: Player,
    heuristic: Heuristics
  ): number {
    switch (heuristic) {
      case Heuristics.SIMPLE: {
        return SimpleHeuristic.calcFitness(game, botType);
      }
      case Heuristics.RANDOM: {
        return RandomHeuristic.calcFitness(game, botType);
      }
      case Heuristics.SIMPLE_EXTENDED: {
        return ExtendendSimple.calcFitness(game, botType);
      }
    }
  }
}

export class BotMoveValue {
  constructor(public fitnessValue: number, public binNumber: number) {}
}

export class SimpleHeuristic {
  public static calcFitness(game: Game, botType: Player): number {
    if (botType === Player.A) {
      return game.stonesQtyInStoreA - game.stonesQtyInStoreB;
    }
    return game.stonesQtyInStoreB - game.stonesQtyInStoreA;
  }
}

export class ExtendendSimple {
  public static calcFitness(game: Game, botType: Player): number {
    const stonesQtyInBinsA = ExtendendSimple.getStonesQtyInBinsA(game);
    const stonesQtyInBinsB = ExtendendSimple.getStonesQtyInBinsB(game);

    if (botType === Player.A) {
      return (
        game.stonesQtyInStoreA +
        stonesQtyInBinsA -
        (game.stonesQtyInStoreB + stonesQtyInBinsB)
      );
    }
    return (
      game.stonesQtyInStoreB +
      stonesQtyInBinsB -
      (game.stonesQtyInStoreA + stonesQtyInBinsA)
    );
  }

  public static getStonesQtyInBinsA(game: Game): number {
    let stonesInBin = 0;
    for (
      let i = game.fstBinNumberForPlayerA;
      i <= game.lastBinNumberForPlayerA;
      i++
    ) {
      stonesInBin += game.getStonesQty(i);
    }
    return stonesInBin;
  }

  public static getStonesQtyInBinsB(game: Game): number {
    let stonesInBin = 0;
    for (
      let i = game.fstBinNumberForPlayerB;
      i <= game.lastBinNumberForPlayerB;
      i++
    ) {
      stonesInBin += game.getStonesQty(i);
    }
    return stonesInBin;
  }
}

export class RandomHeuristic {
  public static calcFitness(game: Game, botType: Player): number {
    const allStonesQty = game.binsQtyInRow * 2 * 4;
    const randomNumber = SharedUtils.getRandomInt(-allStonesQty, allStonesQty);
    return randomNumber;
  }
}
