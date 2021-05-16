export class SharedUtils {
  public static logWithoutLineNumber(msg: any): void {
    queueMicrotask(console.log.bind(console, msg));
  }
}
