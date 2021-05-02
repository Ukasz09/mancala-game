import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

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

  holeNumbers: number[];

  constructor() {}

  ngOnInit(): void {
    this.initHoleNumbers();
  }

  private initHoleNumbers(): void {
    this.holeNumbers = Array(this.holesQtyInRow)
      .fill(1)
      .map((_x, i) => i + 1);
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
}
