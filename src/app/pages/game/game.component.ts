import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { Bot } from 'src/app/game-logic/bot';
import { Game } from 'src/app/game-logic/game';
import { GameMode, GameResult, Player } from 'src/app/shared/models';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('gameBoard') boardComponent: BoardComponent;

  public readonly stoneTransitionTimeSec = 2;

  public gameOver = false;
  public gameLogic: Game;
  public gameMode: GameMode;

  private actualGameResult: GameResult;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initActualGameMode();
    this.gameLogic = new Game();
    this.gameLogic.initGame();
    this.startGameInProperMode();
  }

  private initActualGameMode(): void {
    const gameModeText = this.route.snapshot.paramMap.get('mode');
    switch (gameModeText) {
      case GameMode.PLAYER_VS_PLAYER: {
        this.gameMode = GameMode.PLAYER_VS_PLAYER;
        break;
      }
      case GameMode.PLAYER_VS_BOT: {
        this.gameMode = GameMode.PLAYER_VS_BOT;
        break;
      }
      case GameMode.BOT_VS_BOT: {
        this.gameMode = GameMode.BOT_VS_BOT;
        break;
      }
      default: {
        console.warn(
          `Incorrect game mode - running in mode: ${this.gameMode} `
        );
        this.gameMode = GameMode.PLAYER_VS_PLAYER;
        break;
      }
    }
  }

  private startGameInProperMode(): void {
    switch (this.gameMode) {
      // Player vs bot
      case GameMode.PLAYER_VS_BOT: {
        if (this.gameLogic.actualPlayer === Player.A) {
          this.makeMoveByBot(Player.A);
        }
        return;
      }
      // Bot vs bot
      case GameMode.BOT_VS_BOT: {
        this.makeMoveByBot(Player.B);
        return;
      }
    }

    // If Player vs Player than do nothing
  }

  public onRestartGameBtnClick(gameBoard: BoardComponent) {
    this.gameLogic.resetGame();
    gameBoard.resetGame();
    this.gameOver = false;
  }

  public onBinClick(binNumber: number): void {
    this.makeMove(binNumber);
    if (
      !this.gameOver &&
      this.gameMode === GameMode.PLAYER_VS_BOT &&
      this.gameLogic.actualPlayer === Player.A
    ) {
      this.makeMoveByBot(Player.A);
    }
  }

  private makeMove(binNumber: number) {
    const [gameResult, gameOver] = this.gameLogic.makeMove(binNumber);
    this.gameOver = gameOver;
    this.actualGameResult = gameResult;
    this.boardComponent.lastClickedBinNumer = binNumber;
    this.boardComponent.onMoveHasBeenDone();
  }

  public backToHome(): void {
    this.router.navigateByUrl('/home');
  }

  private makeMoveByBot(botPlayer: Player): void {
    const chosenBinByBot = Bot.move(this.gameLogic, botPlayer);
    const delayTime = this.stoneTransitionTimeSec * 1000;
    timer(delayTime).subscribe(() => {
      this.makeMove(chosenBinByBot);
      // Player vs bot
      if (this.gameMode === GameMode.PLAYER_VS_BOT) {
        if (!this.gameOver && this.gameLogic.actualPlayer === botPlayer) {
          this.makeMoveByBot(botPlayer);
        }
      }
      // Bot vs bot
      else if (this.gameMode === GameMode.BOT_VS_BOT) {
        if (!this.gameOver) {
          if (this.gameLogic.actualPlayer === botPlayer) {
            this.makeMoveByBot(botPlayer);
          } else {
            const nextPlayer = botPlayer === Player.A ? Player.B : Player.A;
            this.makeMoveByBot(nextPlayer);
          }
        }
      }
    });
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */
  get headerText(): string {
    return this.gameOver ? 'Game over' : 'Mancala Game';
  }

  get winnerInfoText(): string {
    if (this.actualGameResult === GameResult.TIE) {
      return "It's a tie !";
    }
    return this.actualGameResult === GameResult.WINNER_A
      ? 'Player A won !'
      : 'Player B won !';
  }
}
