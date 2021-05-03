import { Game } from './game';

export class Bot {
  private static MAX_DEPTH = 3;

  public move(game: Game): number {
    let i = 1;
    let binNumber = -1;
    while (i <= Bot.MAX_DEPTH) {
      const newMove: BotMoveValue = this.maxAction(game, i);
      binNumber = newMove.binNumber;
      i++;
    }
    return binNumber;
  }

  public maxAction(
    game: Game,
    currentDepth: number,
    maxDepth: number = Bot.MAX_DEPTH
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MIN_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === maxDepth) {
      newMove.binNumber = -1;
      newMove.fitnessValue = FitnessValue.calcFitness(game);
      return newMove;
    }
    let fitnessValue = Number.MIN_SAFE_INTEGER;
    for (
      let binNumber = game.lastBinNumberForPlayerB;
      binNumber >= game.fstBinNumberForPlayerB;
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
            this.minAction(clonedGame, currentDepth + 1, maxDepth).fitnessValue
          );
        else
          fitnessValue = Math.max(
            fitnessValue,
            this.maxAction(clonedGame, currentDepth + 1, maxDepth).fitnessValue
          );

        if (fintessValueBefore < fitnessValue) {
          newMove.fitnessValue = fitnessValue;
          newMove.binNumber = binNumber;
        }
      }
    }
    return newMove;
  }

  public minAction(
    game: Game,
    currentDepth: number,
    maxDepth: number = Bot.MAX_DEPTH
  ): BotMoveValue {
    const newMove = new BotMoveValue(Number.MAX_SAFE_INTEGER, 1);

    if (game.gameIsOver || currentDepth === maxDepth) {
      newMove.binNumber = -1;
      newMove.fitnessValue = FitnessValue.calcFitness(game);
      return newMove;
    }
    let fitnessValue = Number.MAX_SAFE_INTEGER;
    for (
      let binNumber = game.lastBinNumberForPlayerA;
      binNumber >= game.fstBinNumberForPlayerA;
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
            this.maxAction(clonedGame, currentDepth + 1, maxDepth).fitnessValue
          );
        else
          fitnessValue = Math.min(
            fitnessValue,
            this.minAction(clonedGame, currentDepth + 1, maxDepth).fitnessValue
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
  public static calcFitness(game: Game): number {
    const stonesInStoreDiff = game.stonesQtyInStoreB - game.stonesQtyInStoreA;
    const stonesInBinsDiff =
      this.getStonesQtyForPlayerA(game) - this.getStonesQtyForPlayerB(game);
    return stonesInStoreDiff + stonesInBinsDiff;
  }

  private static getStonesQtyForPlayerA(game: Game): number {
    let stonesQty = 0;
    for (
      let i = game.fstBinNumberForPlayerA;
      i <= game.lastBinNumberForPlayerA;
      i++
    ) {
      stonesQty += game.getStonesQty(i);
    }
    return stonesQty;
  }

  private static getStonesQtyForPlayerB(game: Game): number {
    let stonesQty = 0;
    for (
      let i = game.fstBinNumberForPlayerB;
      i <= game.lastBinNumberForPlayerB;
      i++
    ) {
      stonesQty += game.getStonesQty(i);
    }
    return stonesQty;
  }
}
// PSEUDO-CODE
//
// function minimax(node, depth, maximizingPlayer)
//     if depth = 0 or node is a terminal node
//         return the heuristic value of node
//     if maximizingPlayer
//         bestValue := -∞
//         for each child of node
//             # here is a small change
//             if freeTurn(child):
//                isMax := TRUE
//             else:
//                isMax := FALSE
//             val := minimax(child, depth - 1, isMax)
//             bestValue := max(bestValue, val)
//         return bestValue
//     else
//         bestValue := +∞
//         for each child of node
//             # here is a small change
//             if freeTurn(child):
//                isMax := FALSE
//             else:
//                isMax := TRUE
//             val := minimax(child, depth - 1, isMax)
//             bestValue := min(bestValue, val)
//         return bestValue
