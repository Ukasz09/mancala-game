import { SharedUtils } from '../shared/logic/utils';
import { GameResult, Player } from '../shared/models';
import { Bot } from './bot';
import { Game } from './game';

export class ReportMaker {
  private game: Game;

  constructor() {
    this.game = new Game();
  }

  public makeReport(maxDepth: number, gameRepeatsQty: number) {
    for (let i = 0; i < gameRepeatsQty; i++) {
      SharedUtils.logWithoutLineNumber(
        `--------------- Started game (depth=${maxDepth}, repeatNo=${
          i + 1
        }/${gameRepeatsQty}) ---------------`
      );
      const startBinNumber = this.initGame();
      this.playGame(startBinNumber, maxDepth);
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

  private playGame(binNumber: number, maxDepth: number) {
    const [gameResult, gameIsFinished] = this.game.makeMove(binNumber);
    if (gameIsFinished) {
      this.logResultOnGameOver(gameResult);
    } else {
      const chosenBinByBot = Bot.move(
        this.game,
        this.game.actualPlayer,
        maxDepth
      );
      this.playGame(chosenBinByBot, maxDepth);
    }
  }

  private logResultOnGameOver(gameResult: GameResult) {
    const winner = this.getWinner(gameResult);
    if (winner != -1) {
      const movesQty = this.game.movesQty.get(winner);
      SharedUtils.logWithoutLineNumber(`WINNER,${movesQty}`);
    } else {
      SharedUtils.logWithoutLineNumber(`WINNER,${-1}`); // It's a tie
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
