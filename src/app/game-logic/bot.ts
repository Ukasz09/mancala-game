import { SharedUtils } from '../shared/logic/utils';
import { Player } from '../shared/models';
import { Game } from './game';

export class Bot {
  private static MAX_DEPTH = 4;

  public static move(game: Game, botType: Player): number {
    const clonedGame = game.clone();
    const startTimeMs = new Date().getTime();
    const newMove: BotMoveValue = this.maxAction(
      clonedGame,
      Bot.MAX_DEPTH,
      botType
    );
    const endTimeMs = new Date().getTime();
    const elapsedTime = endTimeMs - startTimeMs;
    SharedUtils.logWithoutLineNumber(`${Player[botType]},${elapsedTime}`);
    return newMove.binNumber;
  }

  private static maxAction(
    game: Game,
    currentDepth: number,
    botType: Player
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MIN_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = FitnessValue.calcFitness(game, botType);
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

        if (!extraTurn)
          fitnessValue = Math.max(
            fitnessValue,
            this.minAction(clonedGame, currentDepth - 1, botType).fitnessValue
          );
        else
          fitnessValue = Math.max(
            fitnessValue,
            this.maxAction(clonedGame, currentDepth - 1, botType).fitnessValue
          );

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
    botType: Player
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MAX_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === 0) {
      newMove.binNumber = -1;
      newMove.fitnessValue = FitnessValue.calcFitness(game, botType);
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

        if (!extraTurn)
          fitnessValue = Math.min(
            fitnessValue,
            this.maxAction(clonedGame, currentDepth - 1, botType).fitnessValue
          );
        else
          fitnessValue = Math.min(
            fitnessValue,
            this.minAction(clonedGame, currentDepth - 1, botType).fitnessValue
          );

        if (fintessValueBefore > fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
      }
    }
    return newMove;
  }
}

export class BotMoveValue {
  constructor(public fitnessValue: number, public binNumber: number) {}
}

export class FitnessValue {
  public static calcFitness(game: Game, botType: Player): number {
    if (botType === Player.A) {
      return game.stonesQtyInStoreA - game.stonesQtyInStoreB;
    }
    return game.stonesQtyInStoreB - game.stonesQtyInStoreA;
  }
}
