import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  boardWidthPx: number;
  boardHeightPx: number;
  storeHeightPx: number;
  binSizePx: number;

  stoneModels: Map<number, Stone> = new Map(); // <stoneId, stone model>
  binNumbersPlayerA: number[] = [];
  binNumbersPlayerB: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initWidths();
    this.initBinNumbers();
    this.initStoneModels();
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
    return `url(/assets/images/stone-00${stoneImageNumber}.png)`;
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

  setRandomPostionForStones(stoneIds: number[]): void {
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
    this.initStoneModels();
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
