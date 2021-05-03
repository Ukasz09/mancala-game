import { Component, OnInit } from '@angular/core';
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
  public gameOver = false;
  public gameLogic: Game;
  private actualGameResult: GameResult;
  private botA: Bot = undefined;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameLogic = new Game();
    this.gameLogic.initGame();
    if (this.isPlayerVsbotMode) {
      this.botA = new Bot();
      if (this.gameLogic.actualPlayer === Player.A) {
        this.makeMoveByBot();
      }
    }
  }

  public onRestartGameBtnClick(gameBoard: BoardComponent) {
    this.gameLogic.resetGame();
    gameBoard.resetGame();
    this.gameOver = false;
  }

  public onBinClick(binNumber: number): void {
    this.makeMove(binNumber);
    console.log('user:' + binNumber, this.gameLogic.bins);
    if (
      !this.gameOver &&
      this.isPlayerVsbotMode &&
      this.gameLogic.actualPlayer === Player.A
    ) {
      this.makeMoveByBot();
    }
  }

  private makeMove(binNumber: number) {
    const [gameResult, gameOver] = this.gameLogic.makeMove(binNumber);
    this.gameOver = gameOver;
    this.actualGameResult = gameResult;
  }

  public backToHome(): void {
    this.router.navigateByUrl('/home');
  }

  private makeMoveByBot(): void {
    const chosenBinByBot = this.botA.move(this.gameLogic);
    this.makeMove(chosenBinByBot);
    if (
      !this.gameOver &&
      this.isPlayerVsbotMode &&
      this.gameLogic.actualPlayer === Player.A
    ) {
      this.makeMoveByBot();
    }
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

  get actualGameModeText(): string {
    return this.route.snapshot.paramMap.get('mode');
  }

  get isPlayerVsbotMode(): boolean {
    return this.actualGameModeText === GameMode.PLAYER_VS_BOT;
  }
}
