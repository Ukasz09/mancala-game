import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { timer } from 'rxjs';
import { Game } from 'src/app/game-logic/game';
import { Player } from '../../../shared/models/player';
import { Stone } from '../models';
import { BoardConstants } from './board-constants';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() gameLogic: Game;
  @Output() binClick: EventEmitter<number> = new EventEmitter();

  private readonly stoneMovingAnimationTimeMs = 5000; // ! Need to be the same as in stone's css animation property !

  boardWidthPx: number;
  boardHeightPx: number;
  storeHeightPx: number;
  binSizePx: number;

  stoneModels: Map<number, Stone> = new Map(); // <stoneId, stone model>
  binNumbersPlayerA: number[] = [];
  binNumbersPlayerB: number[] = [];
  binsSnapshot: Map<number, number[]> = new Map();
  stonesWithMovingAnimation: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initWidths();
    this.initBinNumbers();
    this.initStoneModels();
    this.makeBinsSnapshot();
  }

  private initWidths(): void {
    this.boardWidthPx = window.innerWidth * BoardConstants.BOARD_WIDTH_PERC;
    if (this.boardWidthPx > BoardConstants.MAX_BOARD_WIDTH_PX) {
      this.boardWidthPx = BoardConstants.MAX_BOARD_WIDTH_PX;
    }
    this.binSizePx = this.boardWidthPx / (this.gameLogic.binsQtyInRow + 3);

    this.boardHeightPx = window.innerHeight * BoardConstants.BOARD_HEIGHT_PERC;
    if (this.boardHeightPx < BoardConstants.MIN_BOARD_HEIGHT_PX) {
      this.boardHeightPx = BoardConstants.MIN_BOARD_HEIGHT_PX;
    }

    this.storeHeightPx = this.boardHeightPx * BoardConstants.STORE_HEIGHT_PERC;
  }

  private initBinNumbers(): void {
    this.binNumbersPlayerB = Array(this.gameLogic.binsQtyInRow)
      .fill(this.gameLogic.fstBinNumberForPlayerB)
      .map((x, i) => i);

    this.binNumbersPlayerA = Array(this.gameLogic.binsQtyInRow)
      .fill(this.gameLogic.fstBinNumberForPlayerA)
      .map((x, i) => x + i)
      .reverse();
  }

  private initStoneModels(): void {
    const stoneIds = this.gameLogic.getAllStoneIds();
    for (let stoneId of stoneIds) {
      const stone = this.getStone(stoneId);
      this.stoneModels.set(stoneId, stone);
    }
  }

  private getStone(stoneId: number): Stone {
    const stoneImageNumber = this.getNextStoneImageNumber(stoneId);
    const stoneImageUrl = this.getStoneImageUrl(stoneImageNumber);
    const translateX = this.getRandomStoneTranslateX(this.stoneSize);
    const translateY = this.getRandomStoneTranslateY(this.stoneSize);
    const randRotation = Math.random() * 360;
    const stone = new Stone(
      stoneId,
      stoneImageUrl,
      translateX,
      translateY,
      randRotation
    );
    return stone;
  }

  private getNextStoneImageNumber(stoneId: number): number {
    return stoneId % (BoardConstants.MAX_STONE_NUMBER + 1);
  }

  private getStoneImageUrl(stoneImageNumber: number): string {
    const paddedStrStoneNumb = stoneImageNumber.toString().padStart(3, '0');
    const imagePath = BoardConstants.stonesImagePathPrefix.replace(
      '{stoneNumber}',
      paddedStrStoneNumb
    );
    return `url(${imagePath}`;
  }

  private getRandomStoneTranslateX(stoneSize: number): number {
    const centerPosition = this.binSizePx / 2 - stoneSize / 2;
    const randOffset = this.getStoneRandomOffset(stoneSize);
    return centerPosition + randOffset;
  }

  private getRandomStoneTranslateY(stoneSize: number): number {
    const centerPosition = -this.binSizePx / 2 - stoneSize / 2;
    const randOffset = this.getStoneRandomOffset(stoneSize);
    return centerPosition + randOffset;
  }

  private getStoneRandomOffset(stoneSize: number): number {
    const randOffset = Math.random() * (2 * stoneSize) - stoneSize;
    return randOffset;
  }

  public setRandomPostionForStones(stoneIds: number[]): void {
    for (let stoneId of stoneIds) {
      const stone = this.stoneModels.get(stoneId);
      stone.translatePositonX = this.getRandomStoneTranslateX(this.stoneSize);
      stone.translatePositonY = this.getRandomStoneTranslateY(this.stoneSize);
    }
  }

  public binIsActive(player: Player, binNumber: number): boolean {
    const actualPlayerBin = player === this.gameLogic.actualPlayer;
    const stonesInBin = this.gameLogic.getStoneIdsForBin(binNumber);
    const BinNotEmpty = stonesInBin?.length > 0;
    return actualPlayerBin && BinNotEmpty;
  }

  public onBinClick(binNumber: number) {
    this.binClick.emit(binNumber);
  }

  public setRandomTranslateYForStoneInStore(stoneId: number): void {
    const centerPosition = -this.storeHeightPx / 2 - this.stoneSize / 2;
    const randOffset = (Math.random() * this.storeHeightPx) / 3;
    const translateY = centerPosition + randOffset;
    const stone = this.stoneModels.get(stoneId);
    stone.translatePositonY = translateY;
  }

  public resetGame(): void {
    this.initBinNumbers();
    this.initStoneModels();
  }

  public onMoveHasBeenDone() {
    this.updateStoneTranslateValue();
    timer(this.stoneMovingAnimationTimeMs).subscribe(() => {
      console.log('Timer end - making snapshot');
      this.resetAnimatedStoneTranslate();
      this.stonesWithMovingAnimation = [];
      this.makeBinsSnapshot();
    });
  }

  private makeBinsSnapshot() {
    this.binsSnapshot = this.gameLogic.cloneBins();
  }

  public getStoneIdsForBin(binNumber: number): number[] {
    return this.binsSnapshot.get(binNumber);
  }

  /**
   * @returns <stone-number, (translate-value-X, translate-value-Y)>
   */
  private updateStoneTranslateValue(): void {
    const stonesWithMovingAnimation = [];
    for (const binNumber of this.binsSnapshot.keys()) {
      const stonesNumberFromSnapshot = this.binsSnapshot.get(binNumber);
      const stonesNumberFromGame = this.gameLogic.getStoneIdsForBin(binNumber);
      for (const stoneNumber of stonesNumberFromSnapshot) {
        // If stone is moved
        const stoneIsMoved = !stonesNumberFromGame.includes(stoneNumber);
        if (stoneIsMoved) {
          const newBinNumber = this.getBinNumberForStone(stoneNumber);
          const translateX = this.getStoneXTranslate(binNumber, newBinNumber);
          const translateY = this.getStoneYTranslate(binNumber, newBinNumber);
          const stone = this.stoneModels.get(stoneNumber);
          stone.translatePositonX = translateX;
          stone.translatePositonY = translateY;
          stonesWithMovingAnimation.push(stoneNumber);
        }
      }
    }
    this.stonesWithMovingAnimation = stonesWithMovingAnimation;
  }

  private getBinNumberForStone(wantedStoneNumber: number): number {
    for (let binNumber of this.gameLogic.binNumbers) {
      const stoneNumbersFromGame = this.gameLogic.getStoneIdsForBin(binNumber);
      for (let stoneNumber of stoneNumbersFromGame) {
        if (stoneNumber === wantedStoneNumber) {
          return binNumber;
        }
      }
    }
    return -1;
  }

  private getStoneXTranslate(
    actualBinNumber: number,
    newBinNumber: number
  ): number {
    let newBinOffset = newBinNumber;
    if (newBinNumber > this.gameLogic.binNumberPlayerStoreB) {
      newBinOffset =
        this.gameLogic.binsQtyInRow -
        1 -
        (newBinNumber % (this.gameLogic.binsQtyInRow + 1));
    }

    let actualBinOffset = actualBinNumber;
    if (actualBinNumber > this.gameLogic.binNumberPlayerStoreB) {
      actualBinOffset =
        this.gameLogic.binsQtyInRow -
        1 -
        (actualBinNumber % (this.gameLogic.binsQtyInRow + 1));
    }

    return (
      (newBinOffset - actualBinOffset) * this.binSizePx + this.binSizePx / 2
    );
  }

  private getStoneYTranslate(
    actualBinNumber: number,
    newBinNumber: number
  ): number {
    const newBinNumberOffset = this.gameLogic.binBelongsToPlayerA(newBinNumber)
      ? 1
      : 0;
    const actualBinNumberOffset = this.gameLogic.binBelongsToPlayerA(
      actualBinNumber
    )
      ? 1
      : 0;
    return (
      -1 * (newBinNumberOffset - actualBinNumberOffset) * this.boardHeightPx -
      this.binSizePx / 2
    );
  }

  private resetAnimatedStoneTranslate(): void {
    for (let stoneNumber of this.stonesWithMovingAnimation) {
      const stone = this.stoneModels.get(stoneNumber);
      // TODO: Improve
      stone.translatePositonX = this.getRandomStoneTranslateX(stoneNumber);
      stone.translatePositonY = this.getRandomStoneTranslateY(stoneNumber);
    }
  }

  /* ------------------------------------------- Getters & Setters ------------------------------------------- */

  get stoneSize(): number {
    return this.binSizePx * BoardConstants.STONE_SIZE_PERC;
  }

  get playerA(): Player {
    return Player.A;
  }

  get playerB(): Player {
    return Player.B;
  }
}
