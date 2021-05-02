import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private boardNumber = 0;
  private maxBoardNumber = 7;
  private holeNumber = 0;
  private maxHoleNumber = 9;

  constructor() {}

  ngOnInit(): void {}

  public onNextBoardClick(): void {
    this.boardNumber = ++this.boardNumber % (this.maxBoardNumber + 1);
  }

  public onNextHoleClick(): void {
    this.holeNumber = ++this.holeNumber % (this.maxHoleNumber + 1);
  }

  /* ------------------------------------------- Getters / setters ------------------------------------------- */
  get boardImageUrl(): string {
    return `url(/assets/images/cartoon-wood-00${this.boardNumber}.jpg)`;
  }
}
