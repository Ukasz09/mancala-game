import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Stone } from './models/stone';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewInit {
  @ViewChild('holesContainer') holesContainer: ElementRef;

  private boardNumber = 0;
  private maxBoardNumber = 4;
  private holeNumber = 0;
  private maxHoleNumber = 1;
  private holesQtyInRow = 6;
  private stonesInAHoleAtStartQty = 4;
  private maxStoneNumber = 3;
  private stones: Map<number, Stone[]> = new Map();

  leftPlayerHoleNumbers: number[];
  rightPlayerHoleNumbers: number[];

  constructor() {}

  ngOnInit(): void {
    this.initLeftPlayerHoleNumbers();
    this.initRightPlayerHoleNumbers();
  }

  ngAfterViewInit(): void {
    const holeSize = this.getHoleSize(
      this.holesContainer.nativeElement.offsetWidth
    );
    this.initStones(holeSize);
    this.setRandomPostionForStones(holeSize);
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

  private initStones(holeSize: number): void {
    for (const number of this.leftPlayerHoleNumbers) {
      const newStones = this.getStartedStones(holeSize);
      this.stones.set(number, newStones);
    }
    for (const number of this.rightPlayerHoleNumbers) {
      const newStones = this.getStartedStones(holeSize);
      this.stones.set(number, newStones);
    }
  }

  private getStartedStones(holeSize: number): Stone[] {
    const stones: Stone[] = [];
    for (let i = 0; i < this.stonesInAHoleAtStartQty; i++) {
      const stoneImageNumber = i % (this.maxStoneNumber + 1);
      const stoneImageUrl = this.getStoneImageUrl(stoneImageNumber);
      const translateX = this.getRandomStoneTranslateX(
        holeSize,
        this.getStoneSize(holeSize)
      );
      const translateY = this.getRandomStoneTranslateY(
        holeSize,
        this.getStoneSize(holeSize)
      );
      const rotation = Math.random() * 360;
      const stone = new Stone(stoneImageUrl, translateX, translateY, rotation);
      stones.push(stone);
    }
    return stones;
  }

  private setRandomPostionForStones(holeSize: number): void {
    for (let holeNumber of this.stones.keys()) {
      const stones = this.stones.get(+holeNumber);
      for (let stone of stones) {
        stone.translatePositonX = this.getRandomStoneTranslateX(
          holeSize,
          this.getStoneSize(holeSize)
        );
        stone.translatePositonY = this.getRandomStoneTranslateY(
          holeSize,
          this.getStoneSize(holeSize)
        );
      }
    }
  }

  private getRandomStoneTranslateX(
    holeSize: number,
    stoneSize: number
  ): number {
    const centerPosition = holeSize / 2 - stoneSize / 2;
    const randOffset = Math.random() * (2 * stoneSize) - stoneSize;
    return centerPosition + randOffset;
  }

  private getRandomStoneTranslateY(
    holeSize: number,
    stoneSize: number
  ): number {
    const centerPosition = -holeSize / 2 - stoneSize / 2;
    const randOffset = Math.random() * (2 * stoneSize) - stoneSize;
    return centerPosition + randOffset;
  }

  private getStoneImageUrl(stoneImageNumber: number): string {
    return `url(/assets/images/stone-00${stoneImageNumber}.png)`;
  }

  public onNextBoardClick(): void {
    this.boardNumber = ++this.boardNumber % (this.maxBoardNumber + 1);
  }

  public onNextHoleClick(): void {
    this.holeNumber = ++this.holeNumber % (this.maxHoleNumber + 1);
  }

  public getStones(holeNumber: number): Stone[] {
    return this.stones.get(holeNumber);
  }

  public getHoleSize(holesContainerWidth: number) {
    return holesContainerWidth / this.holesQtyInRow;
  }

  getStoneSize(holeSize: number): number {
    return holeSize / 4;
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
