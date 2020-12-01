/** Use window.open to open a new tab. */
export class WindowOpen {
  public static readonly type = '[Window] Open Url';
  constructor(public readonly url: string, public readonly target: string) {
    // Empty
  }
}
