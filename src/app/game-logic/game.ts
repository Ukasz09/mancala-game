import { GameResult, Player } from '../shared/models';

export class Game {
  public readonly binsQtyInRow = 6;
  private readonly startedStonesQty = 4;

  public actualPlayer: Player = Player.B;
  public gameIsOver = false;
  public bins: Map<number, number[]> = new Map(); // <bin number, array of stone's id>

  constructor() {}

  public initGame() {
    // this.chooseActualPlayerByRandom();
    this.initBins();
  }

  public clone(): Game {
    const clonedGame = new Game();
    clonedGame.actualPlayer = this.actualPlayer;
    clonedGame.gameIsOver = this.gameIsOver;
    for (const binNumber of this.bins.keys()) {
      clonedGame.bins.set(binNumber, [...this.bins.get(binNumber)]);
    }
    return clonedGame;
  }

  private chooseActualPlayerByRandom(): void {
    this.actualPlayer = Math.random() > 0.5 ? Player.A : Player.B;
  }

  private initBins(): void {
    let stoneIndex = 0;
    for (let i = 0; i < this.totalBinsAndStoresQty; i++) {
      const binStonesId = [];
      if (
        i !== this.binNumberPlayerStoreA &&
        i !== this.binNumberPlayerStoreB
      ) {
        for (let j = 0; j < this.startedStonesQty; j++) {
          binStonesId.push(stoneIndex);
          stoneIndex++;
        }
      }
      this.bins.set(i, binStonesId);
    }
  }

  public getStoneIdsForBin(binNumber: number): number[] {
    return this.bins.get(binNumber);
  }

  public getAllStoneIds(): number[] {
    let stoneIds = [];
    for (let binNumber of this.bins.keys()) {
      const stones = this.getStoneIdsForBin(binNumber);
      stoneIds = stoneIds.concat(stones);
    }
    return stoneIds;
  }

  private changePlayer() {
    this.actualPlayer = (this.actualPlayer.valueOf() + 1) % 2;
  }

  /**
   *
   * @returns [Actual game result, Is game finished]
   */
  public makeMove(binNumber: number): [GameResult, boolean] {
    const lastUsedBinNumber = this.distributeStones(binNumber);
    const playerHasAdditionalMove = this.playerHasAdditionalMove(
      lastUsedBinNumber
    );
    if (!playerHasAdditionalMove) {
      // Check wheter need to steal stones
      const stonesQtyInBin = this.getStonesQty(lastUsedBinNumber);
      const needToStealStones =
        this.binBelongsToActualPlayer(lastUsedBinNumber) &&
        stonesQtyInBin === 1;
      if (needToStealStones) {
        this.stealStones(lastUsedBinNumber);
      }
      this.changePlayer();
    }

    this.gameIsOver = this.collectAllStonesWhenEmptyBins();
    return [this.getActualGameResult(), this.gameIsOver];
  }

  /**
   * @returns Number of bin to which last stone has been added
   */
  private distributeStones(binNumber: number): number {
    var stoneIds = this.bins.get(binNumber);
    this.clearBin(binNumber);

    let actualBinNumer = binNumber;
    for (let stoneId of stoneIds) {
      actualBinNumer = this.getNextBinNumber(actualBinNumer);

      // Check whether needs to add stone to store A
      if (binNumber === this.binNumberPlayerStoreA) {
        if (this.actualPlayer === Player.A) {
          this.addStoneToStoreA(stoneId);
        }
        // Store belong to the opponent - Add stone to next bin
        else {
          actualBinNumer = this.getNextBinNumber(actualBinNumer);
          this.addStoneToBin(actualBinNumer, stoneId);
        }
      }
      // Check whether needs to add stone to store B
      else if (binNumber === this.binNumberPlayerStoreB) {
        if (this.actualPlayer === Player.B) {
          this.addStoneToStoreB(stoneId);
        }
        // Store belong to the opponent - Add stone to next bin
        else {
          actualBinNumer = this.getNextBinNumber(actualBinNumer);
          this.addStoneToBin(actualBinNumer, stoneId);
        }
      }
      // Add to actual bin
      else {
        this.addStoneToBin(actualBinNumer, stoneId);
      }
    }
    return actualBinNumer;
  }

  private clearBin(binNumber: number): void {
    this.bins.set(binNumber, []);
  }

  private getNextBinNumber(binNumber: number): number {
    return (binNumber + 1) % this.totalBinsAndStoresQty;
  }

  private addStoneToBin(binNumber: number, stoneId: number): void {
    const stones = this.bins.get(binNumber);
    stones.push(stoneId);
  }

  private addStoneToStoreA(stoneId: number): void {
    const stonesInStore = this.bins.get(this.binNumberPlayerStoreA);
    stonesInStore.push(stoneId);
  }

  private addStoneToStoreB(stoneId: number): void {
    const stonesInStore = this.bins.get(this.binNumberPlayerStoreB);
    stonesInStore.push(stoneId);
  }

  private playerHasAdditionalMove(lastBinNumber: number): boolean {
    return (
      lastBinNumber === this.binNumberPlayerStoreA ||
      lastBinNumber === this.binNumberPlayerStoreB
    );
  }

  private binBelongsToActualPlayer(binNumber: number): boolean {
    return this.binBelongsToPlayer(binNumber, this.actualPlayer);
  }

  public binBelongsToPlayer(binNumber: number, player: Player): boolean {
    const fstBinNumber =
      player === Player.A
        ? this.fstBinNumberForPlayerA
        : this.fstBinNumberForPlayerB;
    const lastBinNumber =
      player === Player.A
        ? this.lastBinNumberForPlayerA
        : this.lastBinNumberForPlayerB;
    return binNumber >= fstBinNumber && binNumber <= lastBinNumber;
  }

  public binBelongsToPlayerA(binNumber: number): boolean {
    return (
      binNumber >= this.fstBinNumberForPlayerA &&
      binNumber <= this.lastBinNumberForPlayerA
    );
  }

  public binBelongsToPlayerB(binNumber: number): boolean {
    return (
      binNumber >= this.fstBinNumberForPlayerB &&
      binNumber <= this.lastBinNumberForPlayerB
    );
  }

  public getStonesQty(binNumber: number): number {
    const stones = this.bins.get(binNumber);
    return stones?.length ?? 0;
  }

  private stealStones(actualPlayerBinNumber: number): void {
    const oppositeBinNumber = this.getOppositeBinNumber(actualPlayerBinNumber);
    const stonesFromTheOppositeBin = this.bins.get(oppositeBinNumber);
    if (stonesFromTheOppositeBin.length > 0) {
      // Steal from the opponent
      this.takeAllStonesFromBinToStore(
        oppositeBinNumber,
        this.actualPlayerStoreStones
      );

      // Add own stone to store
      const stone = this.bins.get(actualPlayerBinNumber)[0];
      this.actualPlayerStoreStones.push(stone);
      this.clearBin(actualPlayerBinNumber);
    }
  }

  private takeAllStonesFromBinToStore(
    binNumber: number,
    stonesIdInStore: number[]
  ): void {
    const stonesInBin = this.bins.get(binNumber);
    this.clearBin(binNumber);
    for (let stone of stonesInBin) {
      stonesIdInStore.push(stone);
    }
  }

  private getOppositeBinNumber(binNumber: number): number {
    return binNumber + this.binsQtyInRow * 2 - binNumber * 2;
  }

  /**
   *
   * @returns true - need to end game, false - otherwise
   */
  public collectAllStonesWhenEmptyBins(): boolean {
    const emptyBinsPlayerA = this.allBinsEmpty(
      this.fstBinNumberForPlayerA,
      this.lastBinNumberForPlayerA
    );
    const emptyBinsPlayerB = this.allBinsEmpty(
      this.fstBinNumberForPlayerB,
      this.lastBinNumberForPlayerB
    );
    // Nothing to coollect
    if (emptyBinsPlayerA && emptyBinsPlayerB) {
      return true;
    }
    // Collect all stones for player B
    if (emptyBinsPlayerA) {
      const storeStones = this.bins.get(this.binNumberPlayerStoreB);
      this.collectAllStonesToStore(
        this.fstBinNumberForPlayerB,
        this.lastBinNumberForPlayerB,
        storeStones
      );
      return true;
    }
    // Collect all stones for player A
    else if (emptyBinsPlayerB) {
      const storeStones = this.bins.get(this.binNumberPlayerStoreA);
      this.collectAllStonesToStore(
        this.fstBinNumberForPlayerA,
        this.lastBinNumberForPlayerA,
        storeStones
      );
      return true;
    }
    return false;
  }

  public allBinsEmpty(startBinNumber: number, endBinNumber: number): boolean {
    for (let i = startBinNumber; i <= endBinNumber; i++) {
      const stones = this.bins.get(i);
      if (stones.length > 0) {
        return false;
      }
    }
    return true;
  }

  private collectAllStonesToStore(
    startBinNumber: number,
    endBinNumber: number,
    storeStones: number[]
  ): void {
    for (let i = startBinNumber; i <= endBinNumber; i++) {
      const stonesId = this.bins.get(i);
      for (let stoneId of stonesId) {
        storeStones.push(stoneId);
      }
      this.clearBin(i);
    }
  }

  private getActualGameResult(): GameResult {
    const stonesInStoreA = this.getStonesQty(this.binNumberPlayerStoreA);
    const stonesInStoreB = this.getStonesQty(this.binNumberPlayerStoreB);
    if (stonesInStoreA === stonesInStoreB) {
      return GameResult.TIE;
    }
    return stonesInStoreA > stonesInStoreB
      ? GameResult.WINNER_A
      : GameResult.WINNER_B;
  }

  public resetGame(): void {
    this.chooseActualPlayerByRandom();
    this.initBins();
  }

  public illegalMove(binNumber: number): boolean {
    return (
      binNumber < 0 ||
      binNumber >= this.binNumberPlayerStoreA ||
      binNumber === this.binNumberPlayerStoreB ||
      this.getStonesQty(binNumber) === 0
    );
  }

  public cloneBins(): Map<number, number[]> {
    const cloned = new Map();
    for (let binNumber of this.bins.keys()) {
      const clonedStonesId = [...this.bins.get(binNumber)];
      cloned.set(binNumber, clonedStonesId);
    }
    return cloned;
  }

  /* ------------------------------------------- Getters & Setters ------------------------------------------- */

  get binNumberPlayerStoreA(): number {
    return this.binsQtyInRow * 2 + 1;
  }

  get binNumberPlayerStoreB(): number {
    return this.binsQtyInRow;
  }

  get fstBinNumberForPlayerB(): number {
    return 0;
  }

  get lastBinNumberForPlayerB(): number {
    return this.binsQtyInRow - 1;
  }

  get fstBinNumberForPlayerA(): number {
    return this.binsQtyInRow + 1;
  }

  get lastBinNumberForPlayerA(): number {
    return this.binsQtyInRow * 2;
  }

  get totalBinsAndStoresQty(): number {
    return this.binsQtyInRow * 2 + 2;
  }

  get stoneIdsForStoreA(): number[] {
    return this.bins.get(this.binNumberPlayerStoreA);
  }

  get stoneIdsForStoreB(): number[] {
    return this.bins.get(this.binNumberPlayerStoreB);
  }

  get actualPlayerStoreStones(): number[] {
    const storeNumber =
      this.actualPlayer === Player.A
        ? this.binNumberPlayerStoreA
        : this.binNumberPlayerStoreB;
    return this.bins.get(storeNumber);
  }

  get binNumbers(): number[] {
    return Array.from(this.bins.keys());
  }

  get stonesQtyInStoreA(): number {
    return this.stoneIdsForStoreA.length;
  }

  get stonesQtyInStoreB(): number {
    return this.stoneIdsForStoreB.length;
  }
}
