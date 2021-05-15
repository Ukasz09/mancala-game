import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { timer } from 'rxjs';
import { Game } from 'src/app/game-logic/game';
import { GameMode } from 'src/app/shared/models';
import { Player } from '../../../shared/models/player';
import { Stone } from '../models';
import { BoardConstants } from './board-constants';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  private readonly activeBinClass = 'actual-player-move';
  private readonly notActiveBinClass = 'other-player-move';
  private readonly lastClickedBinClass = 'last-clicked-bin';

  @Input() gameLogic: Game;
  @Input() gameMode: GameMode;
  @Input() stoneTransitionTimeSec: number;

  @Output() binClick: EventEmitter<number> = new EventEmitter();

  stoneIds: number[] = [];
  boardWidthPx: number;
  boardHeightPx: number;
  storeHeightPx: number;
  binSizePx: number;

  stoneModels: Map<number, Stone> = new Map(); // <stoneId, stone model>
  binNumbersPlayerA: number[] = [];
  binNumbersPlayerB: number[] = [];
  binsSnapshot: Map<number, number[]> = new Map();
  stonesWithMovingAnimation: number[] = [];
  binsAreClickable = true;
  lastClickedBinNumer: number = undefined;

  constructor() {}

  ngOnInit(): void {
    this.initSize();
    this.initBinNumbers();
    this.initStoneModels();
    this.makeBinsSnapshot();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('Resized');
    this.initSize();
    this.updateStonesPosition();
  }

  //TODO: tmp
  private updateStonesPosition() {
    for (let stoneId of this.stoneIds) {
      const [stonePosX, stonePosY] = this.getStoneStartedPosition(stoneId);
      const randTranslateX = this.getRandomStoneTranslateX(this.stoneSize);
      const randTranslateY = this.getRandomStoneTranslateY(this.stoneSize);
      const stone = this.stoneModels.get(stoneId);
      stone.positonX = stonePosX + randTranslateX;
      stone.positonY = stonePosY + randTranslateY;
    }
  }

  private initSize(): void {
    const boardShouldBeRotated = window.innerWidth < 768;
    if (boardShouldBeRotated) {
      this.boardWidthPx = window.innerHeight * BoardConstants.BOARD_WIDTH_PERC;
      // if (this.boardWidthPx > BoardConstants.MAX_BOARD_WIDTH_PX) {
      //   this.boardWidthPx = BoardConstants.MAX_BOARD_WIDTH_PX;
      // }
      this.binSizePx = this.boardWidthPx / (this.gameLogic.binsQtyInRow + 2);

      this.boardHeightPx = window.innerWidth * 0.8;
      // this.boardHeightPx = window.innerWidth * BoardConstants.BOARD_HEIGHT_PERC;
      // if (this.boardHeightPx < BoardConstants.MIN_BOARD_HEIGHT_PX) {
      //   this.boardHeightPx = BoardConstants.MIN_BOARD_HEIGHT_PX;
      // }

      this.storeHeightPx =
        this.boardHeightPx * BoardConstants.STORE_HEIGHT_PERC;
    } else {
      this.boardWidthPx = window.innerWidth * BoardConstants.BOARD_WIDTH_PERC;
      if (this.boardWidthPx > BoardConstants.MAX_BOARD_WIDTH_PX) {
        this.boardWidthPx = BoardConstants.MAX_BOARD_WIDTH_PX;
      }
      this.binSizePx = this.boardWidthPx / (this.gameLogic.binsQtyInRow + 2);

      this.boardHeightPx =
        window.innerHeight * BoardConstants.BOARD_HEIGHT_PERC;
      if (this.boardHeightPx < BoardConstants.MIN_BOARD_HEIGHT_PX) {
        this.boardHeightPx = BoardConstants.MIN_BOARD_HEIGHT_PX;
      }

      this.storeHeightPx =
        this.boardHeightPx * BoardConstants.STORE_HEIGHT_PERC;
    }
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
    this.stoneIds = stoneIds;
    for (let stoneId of stoneIds) {
      const stone = this.getNewStone(stoneId);
      this.stoneModels.set(stoneId, stone);
    }
  }

  private getNewStone(stoneId: number): Stone {
    const stoneImageNumber = this.getNextStoneImageNumber(stoneId);
    const stoneImageUrl = this.getStoneImageUrl(stoneImageNumber);
    const [positionX, positionY] = this.getStoneStartedPosition(stoneId);
    const randTranslateX = this.getRandomStoneTranslateX(this.stoneSize);
    const randTranslateY = this.getRandomStoneTranslateY(this.stoneSize);
    const stone = new Stone(
      stoneId,
      stoneImageUrl,
      positionX + randTranslateX,
      positionY + randTranslateY,
      this.randomRotationDeg
    );
    return stone;
  }

  /**
   * @returns <stone position X, stone position Y>
   */
  private getStoneStartedPosition(stoneNumber: number): [number, number] {
    const binNumber = this.getBinNumberForStone(stoneNumber);
    const positionX = this.getStoneStartedPosX(binNumber);
    const positionY = this.getStoneStartedPosY(binNumber);
    return [positionX, positionY];
  }

  private getStoneStartedPosX(binNumber: number): number {
    return this.getStoneXTranslate(
      this.gameLogic.binNumberPlayerStoreA,
      binNumber
    );
  }

  private getStoneStartedPosY(binNumber: number): number {
    const binBelongsToA = this.gameLogic.binBelongsToPlayerA(binNumber);
    if (binBelongsToA) {
      return this.binSizePx;
    }
    return this.boardHeightPx;
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
      stone.positonX = this.getRandomStoneTranslateX(this.stoneSize);
      stone.positonY = this.getRandomStoneTranslateY(this.stoneSize);
    }
  }

  public binIsActive(player: Player, binNumber: number): boolean {
    const stonesInBin = this.gameLogic.getStoneIdsForBin(binNumber);
    const binNotEmpty = stonesInBin?.length > 0;
    const actualPlayerBin = player === this.gameLogic.actualPlayer;
    const binIsStoreType =
      this.gameLogic.binNumberPlayerStoreA === binNumber ||
      this.gameLogic.binNumberPlayerStoreB === binNumber;
    const isBotVsBot = this.gameMode === GameMode.BOT_VS_BOT;
    const isPlayerVsBotAndBotTurn =
      this.gameMode === GameMode.PLAYER_VS_BOT &&
      this.gameLogic.actualPlayer === Player.A;
    return (
      !isPlayerVsBotAndBotTurn &&
      !isBotVsBot &&
      this.binsAreClickable &&
      actualPlayerBin &&
      binNotEmpty &&
      !binIsStoreType
    );
  }

  public onStoneClick(stoneNumber: number) {
    const binNumber = this.getBinNumberForStone(stoneNumber);
    const ownerOfBin = this.gameLogic.binBelongsToPlayerA(binNumber)
      ? Player.A
      : Player.B;
    const binIsActive = this.binIsActive(ownerOfBin, binNumber);
    if (binIsActive) {
      this.binClick.emit(binNumber);
    }
  }

  public setRandomTranslateYForStoneInStore(stoneId: number): void {
    const centerPosition = -this.storeHeightPx / 2 - this.stoneSize / 2;
    const randOffset = (Math.random() * this.storeHeightPx) / 3;
    const translateY = centerPosition + randOffset;
    const stone = this.stoneModels.get(stoneId);
    stone.positonY = translateY;
  }

  public resetGame(): void {
    this.initStoneModels();
    this.makeBinsSnapshot();
    this.lastClickedBinNumer = undefined;
  }

  public onMoveHasBeenDone() {
    this.binsAreClickable = false;
    this.updateStoneTranslateValue();
    const delayTime = this.stoneTransitionTimeSec * 1000;
    timer(delayTime).subscribe(() => {
      this.stonesWithMovingAnimation = [];
      this.makeBinsSnapshot();
      this.binsAreClickable = true;
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

          const stone = this.stoneModels.get(stoneNumber);

          // Set position Y
          const goesToStoreB = this.gameLogic.isInStoreB(stoneNumber);
          const goesToStoreA = this.gameLogic.isInStoreA(stoneNumber);
          const randOffset = Math.random() > 0.5 ? 1 : -1;
          const randTranslateY = this.getStoneRandomOffset(this.stoneSize);
          if (goesToStoreA) {
            const translateY =
              this.storeHeightPx / 2 + randOffset * randTranslateY;
            stone.positonY = translateY;
          } else if (goesToStoreB) {
            const translateY =
              this.boardHeightPx -
              this.storeHeightPx / 2 +
              randOffset * randTranslateY;
            stone.positonY = translateY;
          } else {
            stone.positonY += this.getStoneYTranslate(binNumber, newBinNumber);
          }
          // Set position X
          stone.positonX += translateX;
          stone.rotation = this.randomRotationDeg;
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

    return (newBinOffset - actualBinOffset) * this.binSizePx;
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
      -1 *
      (newBinNumberOffset - actualBinNumberOffset) *
      (this.boardHeightPx - this.binSizePx)
    );
  }

  public getBinCssClass(binNumber: number, player: Player): string {
    if (binNumber === this.lastClickedBinNumer) {
      return this.lastClickedBinClass;
    }

    if (this.gameMode === GameMode.PLAYER_VS_BOT) {
      // Turn off all bins
      if (this.gameLogic.actualPlayer === this.playerA) {
        return this.notActiveBinClass;
      }
    } else if (this.gameMode === GameMode.BOT_VS_BOT) {
      return this.notActiveBinClass;
    }

    const isActive = this.binIsActive(player, binNumber);
    if (isActive) {
      return this.activeBinClass;
    }
    return this.notActiveBinClass;
  }

  public getStoneMovingAnimationClass(stoneNumber: number): string {
    return this.stonesWithMovingAnimation.includes(stoneNumber) ? 'moving' : '';
  }

  public getStone(stoneId: number): Stone {
    return this.stoneModels.get(stoneId);
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

  get boardWidthWithPadding(): number {
    return this.boardWidthPx + this.binSizePx / 2;
  }

  get boardHeightWithPadding(): number {
    return this.boardHeightPx + this.binSizePx / 2;
  }

  get randomRotationDeg(): number {
    return Math.random() * 360;
  }
}
