import { Component, OnInit } from '@angular/core';
import { Stone } from './models/stone';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private boardNumber = 0;
  private maxBoardNumber = 4;
  private holeNumber = 0;
  private maxHoleNumber = 1;
  private holesQtyInRow = 6;

  leftPlayerHoleNumbers: number[];
  rightPlayerHoleNumbers: number[];
  stones: Map<number, Stone[]> = new Map();

  constructor() {}

  ngOnInit(): void {
    this.initLeftPlayerHoleNumbers();
    this.initRightPlayerHoleNumbers();
  }

  private initLeftPlayerHoleNumbers(): void {
    this.leftPlayerHoleNumbers = Array(this.holesQtyInRow)
      .fill(1)
      .map((_x, i) => i + 1);
  }

  private initRightPlayerHoleNumbers(): void {
    this.rightPlayerHoleNumbers = Array(this.holesQtyInRow)
      .fill(this.leftPlayerHoleNumbers.length)
      .map((x, i) => x + i + 1);
  }

  public onNextBoardClick(): void {
    this.boardNumber = ++this.boardNumber % (this.maxBoardNumber + 1);
  }

  public onNextHoleClick(): void {
    this.holeNumber = ++this.holeNumber % (this.maxHoleNumber + 1);
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */
  get holeImageUrl(): string {
    return `url(/assets/images/tree-hollow-00${this.holeNumber}.png)`;
  }

  get boardImageUrl(): string {
    return `url(/assets/images/cartoon-wood-00${this.boardNumber}.jpg)`;
  }

  get storeImageUrl(): string {
    return `url(/assets/images/store-001.png)`;
  }
}
