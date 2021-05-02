import { Component, OnInit } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  endOfTheGame = false;

  constructor() {}

  ngOnInit(): void {}

  public onRestartGameBtnClick(gameBoard: BoardComponent) {
    gameBoard.resetGame();
    this.endOfTheGame = false;
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */
  get headerText(): string {
    return this.endOfTheGame ? 'Game over' : 'Mancala Game';
  }
}
