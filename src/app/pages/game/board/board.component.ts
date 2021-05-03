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
import { LabelPosition, StoreKind } from './models/enums';

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

  public actualPlayer = Player.RIGHT_PLAYER;
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
    this.actualPlayer =
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
    const actualPlayerHole = player === this.actualPlayer;
    const stonesInHole = this.holeStones.get(holeNumber);
    const holeNotEmpty = stonesInHole?.length > 0;
    return actualPlayerHole && holeNotEmpty;
  }

  /* ------------------------------------------- Logic ------------------------------------------- */
  public onHoleClick(holeNumber: number) {
    const playerHasAdditionalMove = this.distributeStones(holeNumber);
    // change player
    if (!playerHasAdditionalMove) {
      this.actualPlayer = (this.actualPlayer.valueOf() + 1) % 2;
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
      actualHoleNumer = this.getNextHoleNumber(actualHoleNumer); // +2 because of the stores

      // check whether stone should be added to any store
      if (actualHoleNumer === this.holesQtyInRow) {
        // Right player place stone in his store
        if (this.actualPlayer === Player.RIGHT_PLAYER) {
          this.setRandomTranslateYForStoneInStore(stone);
          this.rightPlayerStoreStones.push(stone);
        }
        // Ommit store of the opponent
        else {
          actualHoleNumer = this.getNextHoleNumber(actualHoleNumer);
          this.addStoneToHole(actualHoleNumer, stone);
        }
      } else if (actualHoleNumer === this.holesQtyInRow * 2 + 1) {
        // Left player place stone in his store
        if (this.actualPlayer === Player.LEFT_PLAYER) {
          this.setRandomTranslateYForStoneInStore(stone);
          this.leftPlayerStoreStones.push(stone);
        }
        // Ommit store of the opponent
        else {
          actualHoleNumer = this.getNextHoleNumber(actualHoleNumer);
          this.addStoneToHole(actualHoleNumer, stone);
        }
      }
      // add to hole
      else {
        this.addStoneToHole(actualHoleNumer, stone);
      }
    }

    // Check if player has additional move and stealing
    var playerHasAdditionalMove = false;
    if (stones.length > 0) {
      if (
        actualHoleNumer === this.holesQtyInRow ||
        actualHoleNumer === this.holesQtyInRow * 2 + 1
      ) {
        playerHasAdditionalMove = true;
      }
      // Check stealing
      else {
        if (this.actualPlayerHoleNumbers.includes(actualHoleNumer)) {
          const stones = this.holeStones.get(actualHoleNumer);
          const wasEmpty = stones.length === 1;
          if (wasEmpty) {
            const holeIndexInArr = this.actualPlayerHoleNumbers.indexOf(
              actualHoleNumer
            );
            const oppositeHoleNumber = this.oppositePlayerHoleNumbers[
              holeIndexInArr
            ];
            const stonesFromTheOppositeHole = this.holeStones.get(
              oppositeHoleNumber
            );

            if (stonesFromTheOppositeHole.length > 0) {
              // Steal from the opponent
              this.takeAllStonesFromHoleToStore(
                oppositeHoleNumber,
                this.actualPlayerStoreStones
              );

              // Add own stone to store
              const stone = this.holeStones.get(actualHoleNumer)[0];
              this.setRandomTranslateYForStoneInStore(stone);
              this.actualPlayerStoreStones.push(stone);
              this.holeStones.set(actualHoleNumer, []);
            }
          }
        }
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
      return false;
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
        return false;
      }
    }

    return playerHasAdditionalMove;
  }

  private getNextHoleNumber(holeNumber: number): number {
    return (holeNumber + 1) % (this.holesQtyInRow * 2 + 2); // +2 because of the stores
  }

  private addStoneToHole(holeNumber: number, stone: Stone): void {
    const nextHoleStones = this.holeStones.get(holeNumber);
    nextHoleStones.push(stone);
  }

  private addAllStonesToStore(
    holeNumbers: number[],
    storeStones: Stone[]
  ): void {
    for (let holeNumber of holeNumbers) {
      this.takeAllStonesFromHoleToStore(holeNumber, storeStones);
    }
  }

  private takeAllStonesFromHoleToStore(
    holeNumber: number,
    storeStones: Stone[]
  ): void {
    const stonesInHole = this.holeStones.get(holeNumber);
    this.holeStones.set(holeNumber, []);
    for (let stone of stonesInHole) {
      this.setRandomTranslateYForStoneInStore(stone);
      storeStones.push(stone);
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

  public getStonesQty(holeNumber: number): number {
    const stones = this.holeStones.get(holeNumber);
    return stones?.length ?? 0;
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

  get actualPlayerHoleNumbers(): number[] {
    return this.actualPlayer === Player.LEFT_PLAYER
      ? this.leftPlayerHoleNumbers
      : this.rightPlayerHoleNumbers;
  }

  get oppositePlayerHoleNumbers(): number[] {
    return this.actualPlayer === Player.LEFT_PLAYER
      ? this.rightPlayerHoleNumbers
      : this.leftPlayerHoleNumbers;
  }

  get actualPlayerStoreStones(): Stone[] {
    return this.actualPlayer === Player.LEFT_PLAYER
      ? this.leftPlayerStoreStones
      : this.rightPlayerStoreStones;
  }

  get rightPlayerLabelPosition(): LabelPosition {
    return LabelPosition.ABOVE;
  }

  get leftPlayerLabelPosition(): LabelPosition {
    return LabelPosition.BELOW;
  }

  get stonesQtyInLeftStore(): number {
    return this.leftPlayerStoreStones?.length ?? 0;
  }

  get stonesQtyInRightStore(): number {
    return this.rightPlayerStoreStones?.length ?? 0;
  }
}
