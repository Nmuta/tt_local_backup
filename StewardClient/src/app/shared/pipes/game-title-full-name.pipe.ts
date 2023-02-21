import { Pipe, PipeTransform } from '@angular/core';
import { GameTitle, GameTitleName } from '@models/enums';

/**
 * A pipe for converting game title into its full name text.
 */
@Pipe({
  name: 'gameTitleFullName',
})
export class GameTitleFullNamePipe implements PipeTransform {
  /** Transform hook. */
  public transform(title: GameTitle): GameTitleName {
    switch (title) {
      case GameTitle.FH5:
        return GameTitleName.FH5;
      case GameTitle.FM8:
        return GameTitleName.FM8;
      case GameTitle.FH4:
        return GameTitleName.FH4;
      case GameTitle.FM7:
        return GameTitleName.FM7;
      case GameTitle.FH3:
        return GameTitleName.FH3;
      default:
        throw new Error(`Invalid game title provided to full name pipe: ${title}`);
    }
  }
}
