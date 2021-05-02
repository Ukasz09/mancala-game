import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Player } from '../models/player';
import { Stone } from './models/stone';
import { StoreKind } from './models/store-kind';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, AfterViewInit {
  //TODO: move gmae logic to parent component

  Player = Player;
  @ViewChild('holesContainer') holesContainer: ElementRef;

  private boardNumber = 0;
  private maxBoardNumber = 4;
  private holeNumber = 0;
  private maxHoleNumber = 1;
  private holesQtyInRow = 6;
  private stonesInAHoleAtStartQty = 4;
  private maxStoneNumber = 3;
  private holeStones: Map<number, Stone[]> = new Map();
  private storeStones: Map<StoreKind, Stone[]> = new Map();
  private readonly actualPlayerMoveClass = 'actual-player-move';
  private readonly otherPlayerMoveClass = 'other-player-move';

  public actualPlayerMove = Player.RIGHT_PLAYER;
  public leftPlayerHoleNumbers: number[];
  public rightPlayerHoleNumbers: number[];

  constructor() {}

  ngOnInit(): void {
    this.initRightPlayerHoleNumbers();
    this.initLeftPlayerHoleNumbers();
    console.log(this.leftPlayerHoleNumbers, this.rightPlayerHoleNumbers);
  }

  ngAfterViewInit(): void {
    const holeSize = this.getHoleSize(
      this.holesContainer.nativeElement.offsetWidth
    );
    this.initStones(holeSize);
  }

  private initRightPlayerHoleNumbers(): void {
    this.rightPlayerHoleNumbers = Array(this.holesQtyInRow)
      .fill(0)
      .map((_x, i) => i);
  }

  private initLeftPlayerHoleNumbers(): void {
    this.leftPlayerHoleNumbers = Array(this.holesQtyInRow)
      .fill(this.rightPlayerHoleNumbers.length)
      .map((x, i) => x + i + 1)
      .reverse();
  }

  private initStones(holeSize: number): void {
    // init stores
    this.storeStones.set(StoreKind.LEFT_PLAYER_STORE, []);
    this.storeStones.set(StoreKind.RIGHT_PLAYER_STORE, []);

    // init holes
    for (const number of this.leftPlayerHoleNumbers) {
      const newStones = this.getStartedStones(holeSize);
      this.holeStones.set(number, newStones);
    }
    for (const number of this.rightPlayerHoleNumbers) {
      const newStones = this.getStartedStones(holeSize);
      this.holeStones.set(number, newStones);
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

  setRandomPostionForStones(holeSize: number): void {
    for (let holeNumber of this.holeStones.keys()) {
      const stones = this.holeStones.get(+holeNumber);
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

  public getHoleStones(holeNumber: number): Stone[] {
    return this.holeStones.get(holeNumber);
  }

  private getStoreStones(storeKind: StoreKind): Stone[] {
    return this.storeStones.get(storeKind);
  }

  public getHoleSize(holesContainerWidth: number) {
    return holesContainerWidth / this.holesQtyInRow;
  }

  public getStoneSize(holeSize: number): number {
    return holeSize / 4;
  }

  public getHolesHighlightCss(player: Player): string {
    return player === this.actualPlayerMove
      ? this.actualPlayerMoveClass
      : this.otherPlayerMoveClass;
  }

  /* ------------------------------------------- Logic ------------------------------------------- */
  public onHoleClick(holeNumber: number) {
    this.distributeStones(holeNumber);
    // change player
    this.actualPlayerMove = (this.actualPlayerMove.valueOf() + 1) % 2;
  }

  private distributeStones(holeNumber: number): void {
    var stones = this.holeStones.get(holeNumber);

    //TODO: don't allow click on empty holes

    // clear hole
    this.holeStones.set(holeNumber, []);

    // distribute stones
    let actualHoleNumer = holeNumber;
    for (let stone of stones) {
      actualHoleNumer = (actualHoleNumer + 1) % (this.holesQtyInRow * 2 + 2); // +2 becouse of the stores

      // check whether stone should be added to any store
      if (actualHoleNumer === this.holesQtyInRow) {
        this.rightPlayerStoreStones.push(stone);
      } else if (actualHoleNumer === this.holesQtyInRow * 2 + 1) {
        this.leftPlayerStoreStones.push(stone);
      }
      // add to hole
      else {
        const nextHoleStones = this.holeStones.get(actualHoleNumer);
        nextHoleStones.push(stone);
      }
    }
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

  get leftPlayerStoreStones(): Stone[] {
    return this.getStoreStones(StoreKind.LEFT_PLAYER_STORE);
  }

  get rightPlayerStoreStones(): Stone[] {
    return this.getStoreStones(StoreKind.RIGHT_PLAYER_STORE);
  }
}
