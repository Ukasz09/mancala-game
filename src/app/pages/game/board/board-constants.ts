export class BoardConstants {
  public static readonly MAX_STONE_NUMBER = 3;
  public static readonly STONE_SIZE_PERC = 0.25;
  public static readonly BOARD_WIDTH_PERC = 0.7;
  public static readonly BOARD_HEIGHT_PERC = 0.6;
  public static readonly STORE_HEIGHT_PERC = 0.75;
  public static readonly MAX_BOARD_WIDTH_PX = 1400;
  public static readonly MIN_BOARD_HEIGHT_PX = 500;

  public static stonesImagePathPrefix =
    '/assets/images/stone-{stoneNumber}.png';
}
