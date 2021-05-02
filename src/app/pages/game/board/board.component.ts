import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
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
  //TODO: move gmae logic to parent component, general refator needed

  Player = Player;
  @ViewChild('holesContainer') holesContainer: ElementRef;
  @ViewChild('storeRightDiv') storeComponentWrapper: ElementRef;

  @Output() endOfTheGame: EventEmitter<boolean> = new EventEmitter();

  private boardNumber = 0;
  private maxBoardNumber = 4;
  private holeNumber = 0;
  private maxHoleNumber = 1;
  private holesQtyInRow = 6;
  private stonesInAHoleAtStartQty = 4;
  private maxStoneNumber = 3;
  private holeStones: Map<number, Stone[]> = new Map();
  private storeStones: Map<StoreKind, Stone[]> = new Map();

  public actualPlayerMove = Player.RIGHT_PLAYER;
  public leftPlayerHoleNumbers: number[];
  public rightPlayerHoleNumbers: number[];

  constructor() {}

  ngOnInit(): void {
    this.setActivePlayerByRandom();
    this.initRightPlayerHoleNumbers();
    this.initLeftPlayerHoleNumbers();
  }

  ngAfterViewInit(): void {
    this.initStones(this.holeSize);
  }

  private setActivePlayerByRandom(): void {
    this.actualPlayerMove =
      Math.random() > 0.5 ? Player.LEFT_PLAYER : Player.RIGHT_PLAYER;
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

  public getHoleIsActive(player: Player, holeNumber: number): boolean {
    const actualPlayerHole = player === this.actualPlayerMove;
    const stonesInHole = this.holeStones.get(holeNumber);
    const holeNotEmpty = stonesInHole?.length > 0;
    return actualPlayerHole && holeNotEmpty;
  }

  /* ------------------------------------------- Logic ------------------------------------------- */
  public onHoleClick(holeNumber: number) {
    const playerHasAdditionalMove = this.distributeStones(holeNumber);
    // change player
    if (!playerHasAdditionalMove) {
      this.actualPlayerMove = (this.actualPlayerMove.valueOf() + 1) % 2;
    }
  }

  /**
   *
   * @returns true - player has additional move
   */
  private distributeStones(holeNumber: number): boolean {
    var stones = this.holeStones.get(holeNumber);

    // clear hole
    this.holeStones.set(holeNumber, []);

    // distribute stones
    let actualHoleNumer = holeNumber;
    for (let stone of stones) {
      actualHoleNumer = (actualHoleNumer + 1) % (this.holesQtyInRow * 2 + 2); // +2 becouse of the stores

      // check whether stone should be added to any store
      if (actualHoleNumer === this.holesQtyInRow) {
        this.setRandomTranslateYForStoneInStore(stone);
        this.rightPlayerStoreStones.push(stone);
      } else if (actualHoleNumer === this.holesQtyInRow * 2 + 1) {
        this.setRandomTranslateYForStoneInStore(stone);
        this.leftPlayerStoreStones.push(stone);
      }
      // add to hole
      else {
        const nextHoleStones = this.holeStones.get(actualHoleNumer);
        nextHoleStones.push(stone);
      }
    }

    // Check end of the game
    const rightPlayerHolesEmpty = this.allHolesEmpty(
      this.rightPlayerHoleNumbers
    );
    if (rightPlayerHolesEmpty) {
      this.addAllStonesToStore(
        this.leftPlayerHoleNumbers,
        this.leftPlayerStoreStones
      );
      this.endOfTheGame.emit(true);
    } else {
      const leftPlayerHolesEmpty = this.allHolesEmpty(
        this.leftPlayerHoleNumbers
      );
      if (leftPlayerHolesEmpty) {
        this.addAllStonesToStore(
          this.rightPlayerHoleNumbers,
          this.rightPlayerStoreStones
        );
        this.endOfTheGame.emit(true);
      }
    }

    // Check if player has additional move
    var playerHasAdditionalMove = false;
    if (stones.length > 0) {
      const lastStone = stones[stones.length - 1];
      const isInAnyStore =
        this.leftPlayerStoreStones.includes(lastStone) ||
        this.rightPlayerStoreStones.includes(lastStone);
      if (isInAnyStore) {
        playerHasAdditionalMove = true;
      }
    }
    return playerHasAdditionalMove;
  }

  private addAllStonesToStore(
    holeNumbers: number[],
    storeStones: Stone[]
  ): void {
    for (let holeNumber of holeNumbers) {
      const stonesInHole = this.holeStones.get(holeNumber);
      this.holeStones.set(holeNumber, []);
      for (let stone of stonesInHole) {
        storeStones.push(stone);
      }
    }
  }

  private allHolesEmpty(holeNumbers: number[]): boolean {
    for (let holeNumber of holeNumbers) {
      const stones = this.holeStones.get(holeNumber);
      if (stones.length > 0) {
        return false;
      }
    }
    return true;
  }

  private setRandomTranslateYForStoneInStore(stone: Stone): void {
    const storeHeight = this.storeComponentWrapper.nativeElement.offsetHeight;
    const stoneSize = this.getStoneSize(this.holeSize);
    const centerPosition = -storeHeight / 2 - stoneSize / 2;
    const dispersionOffset = 4;
    const randOffset =
      Math.random() * (2 * dispersionOffset * stoneSize) -
      stoneSize * dispersionOffset;
    const translateY = centerPosition + randOffset;
    stone.translatePositonY = translateY;
  }

  public resetGame(): void {
    this.setActivePlayerByRandom();
    this.initRightPlayerHoleNumbers();
    this.initLeftPlayerHoleNumbers();
    this.initStones(this.holeSize);
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

  get holeSize(): number {
    return this.getHoleSize(this.holesContainer.nativeElement.offsetWidth);
  }
}
