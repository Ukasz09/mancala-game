import { LoggerService } from '../services/logger.service';
import { SharedUtils } from '../shared/logic/utils';
import { GameResult, Player } from '../shared/models';
import { Bot } from './bot';
import { Game } from './game';
import { Heuristics } from './heuristics';

export class ReportMaker {
  private game: Game;

  constructor(private logger: LoggerService) {
    this.game = new Game();
  }

  public makeReport(
    maxDepth: number,
    gameRepeatsQty: number,
    heuristic: Heuristics
  ) {
    for (let i = 0; i < gameRepeatsQty; i++) {
      SharedUtils.logWithoutLineNumber(
        `--------------- Started game (depth=${maxDepth}, repeatNo=${
          i + 1
        }/${gameRepeatsQty}) ---------------`
      );
      const startBinNumber = this.initGame();
      this.playGame(startBinNumber, maxDepth, true, heuristic);
      this.initGame();
      this.playGame(startBinNumber, maxDepth, false, heuristic);
    }
  }

  /**
   * @returns random bin number
   */
  private initGame(): number {
    this.game.initGame();
    this.game.actualPlayer = Player.B;
    const randomBinNumber = SharedUtils.getRandomInt(
      this.game.fstBinNumberForPlayerB,
      this.game.lastBinNumberForPlayerB
    );
    return randomBinNumber;
  }

  private playGame(
    binNumber: number,
    maxDepth: number,
    withAlphaBetaPruning: boolean,
    heuristic: Heuristics
  ) {
    const [gameResult, gameIsFinished] = this.game.makeMove(binNumber);
    const algType = withAlphaBetaPruning ? 'alphaBeta' : 'minimax';
    if (gameIsFinished) {
      this.logResultOnGameOver(
        gameResult,
        withAlphaBetaPruning,
        maxDepth,
        algType,
        heuristic
      );
    } else {
      if (withAlphaBetaPruning) {
        const [chosenBinByBot, moveTime] = Bot.moveWithAlphaBeta(
          this.game,
          this.game.actualPlayer,
          maxDepth,
          heuristic
        );
        const algType = withAlphaBetaPruning ? 'alphaBeta' : 'minimax';
        this.logger.logTimeMeasure(
          moveTime,
          maxDepth,
          algType,
          Heuristics[heuristic]
        );
        this.playGame(
          chosenBinByBot,
          maxDepth,
          withAlphaBetaPruning,
          heuristic
        );
      } else {
        const [chosenBinByBot, moveTime] = Bot.move(
          this.game,
          this.game.actualPlayer,
          maxDepth,
          heuristic
        );
        this.logger.logTimeMeasure(
          moveTime,
          maxDepth,
          algType,
          Heuristics[heuristic]
        );
        this.playGame(
          chosenBinByBot,
          maxDepth,
          withAlphaBetaPruning,
          heuristic
        );
      }
    }
  }

  private logResultOnGameOver(
    gameResult: GameResult,
    withPruning: boolean,
    depth: number,
    algType: string,
    heuristic: Heuristics
  ) {
    const winner = this.getWinner(gameResult);
    if (winner !== -1) {
      const movesQty = this.game.movesQty.get(winner);
      this.logger.logMovesMeasure(
        movesQty,
        depth,
        algType,
        Heuristics[heuristic]
      );
      // SharedUtils.logWithoutLineNumber(`WINNER,${movesQty},${withPruning}`);
    } else {
      this.logger.logMovesMeasure(-1, depth, algType, Heuristics[heuristic]);
    }
  }

  private getWinner(gameResult: GameResult): Player {
    if (gameResult === GameResult.WINNER_A) {
      return Player.A;
    } else if (gameResult === GameResult.WINNER_B) {
      return Player.B;
    }
    return -1;
  }
}
