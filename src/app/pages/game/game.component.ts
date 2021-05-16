import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Bot } from 'src/app/game-logic/bot';
import { Game } from 'src/app/game-logic/game';
import { SharedUtils } from 'src/app/shared/logic/utils';
import { GameMode, GameResult, Player } from 'src/app/shared/models';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameBoard') boardComponent: BoardComponent;

  public readonly stoneTransitionTimeSec = 1.5;

  public gameOver = false;
  public gameLogic: Game;
  public gameMode: GameMode;

  private actualGameResult: GameResult;
  private moveSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnDestroy(): void {
    this.moveSubscription?.unsubscribe();
  }

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
          `Incorrect game mode: ${gameModeText} - running in mode: ${this.gameMode} `
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
        const botPlayer = Player.B;
        const randomBinNumber = SharedUtils.getRandomInt(
          this.gameLogic.fstBinNumberForPlayerB,
          this.gameLogic.lastBinNumberForPlayerB
        );
        const delayTime = 1000; // Delay time for the fst move
        this.moveSubscription = timer(delayTime).subscribe(() => {
          this.makeMove(randomBinNumber);
          if (!this.gameOver) {
            this.makeMoveWithCorrectBot(botPlayer);
          }
        });
        return;
      }
    }

    // If Player vs Player than do nothing
  }

  public onRestartGameBtnClick() {
    const binsClickable = this.boardComponent?.binsAreClickable;
    // Don't allow clicking when move in progress
    if (binsClickable) {
      this.gameLogic.resetGame();
      this.boardComponent.resetGame();
      this.gameOver = false;
      this.gameLogic.actualPlayer = Player.B;
      this.startGameInProperMode();
    }
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
    const chosenBinByBot = Bot.moveWithAlphaBeta(this.gameLogic, botPlayer);
    // const chosenBinByBot = Bot.move(this.gameLogic, botPlayer);
    const delayTime = this.stoneTransitionTimeSec * 1000;
    this.moveSubscription = timer(delayTime).subscribe(() => {
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
          this.makeMoveWithCorrectBot(botPlayer);
        }
      }
    });
  }

  private makeMoveWithCorrectBot(acutalBotPlayer: Player): void {
    if (this.gameLogic.actualPlayer === acutalBotPlayer) {
      this.makeMoveByBot(acutalBotPlayer);
    } else {
      const nextPlayer = acutalBotPlayer === Player.A ? Player.B : Player.A;
      this.makeMoveByBot(nextPlayer);
    }
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */
  get headerText(): string {
    if (!this.gameOver) {
      return 'Mancala Game';
    }
    return `Game over. ${this.winnerInfoText}`;
  }

  get mobileHeaderText(): string {
    return !this.gameOver ? undefined : this.winnerInfoText;
  }

  get playerAText(): string {
    const playerVsPlayer = this.gameMode === GameMode.PLAYER_VS_PLAYER;
    return playerVsPlayer ? 'Player A' : 'Bot A';
  }

  get playerBText(): string {
    const botVsBot = this.gameMode === GameMode.BOT_VS_BOT;
    return botVsBot ? 'Bot B' : 'Player B';
  }

  get mobileTextPlayerA(): string {
    const headerText = this.mobileHeaderText;
    return headerText ?? this.playerAText;
  }

  get moblieTextPlayerB(): string {
    const headerText = this.mobileHeaderText;
    return headerText ? '' : this.playerBText;
  }

  get winnerInfoText(): string {
    if (this.actualGameResult === GameResult.TIE) {
      return "It's a tie !";
    }
    return this.actualGameResult === GameResult.WINNER_A
      ? `${this.playerAText} won !`
      : `${this.playerBText} won !`;
  }

  get resetBtnDisabled(): boolean {
    const botVsBot = this.gameMode === GameMode.BOT_VS_BOT;
    const botVsPlayerAndBotMove =
      this.gameMode === GameMode.PLAYER_VS_BOT &&
      this.gameLogic.actualPlayer === Player.A;
    return botVsBot || botVsPlayerAndBotMove;
  }
}
