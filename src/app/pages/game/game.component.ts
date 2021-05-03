import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/game-logic/game';
import { GameResult } from 'src/app/shared/models';
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameLogic = new Game();
    this.gameLogic.initGame();
  }

  public onRestartGameBtnClick(gameBoard: BoardComponent) {
    gameBoard.resetGame();
    this.gameOver = false;
  }

  public onBinClick(binNumber: number): void {
    const [gameResult, gameOver] = this.gameLogic.makeMove(binNumber);
    this.gameOver = gameOver;
    this.actualGameResult = gameResult;
  }

  public backToHome(): void {
    this.router.navigateByUrl('/home');
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

  get actualGameMode(): string {
    return this.route.snapshot.paramMap.get('mode').split('=')[1];
  }
}
