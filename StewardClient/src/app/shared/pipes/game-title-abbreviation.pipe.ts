import { Pipe, PipeTransform } from '@angular/core';
import { GameTitle, GameTitleAbbreviation } from '@models/enums';

/**
 * A pipe for converting game title into its abbreviated text.
 */
@Pipe({
  name: 'gameTitleAbbreviation',
})
export class GameTitleAbbreviationPipe implements PipeTransform {
  /** Transform hook. string -> string */
  public transform(title: string, shouldPassthruUnknownValues: true): string;
  /** Transform hook. Title -> Title */
  public transform(title: GameTitle): GameTitleAbbreviation;
  /** Transform hook. Type Signature */
  public transform(
    title: GameTitle | string,
    shouldPassthruUnknownValues: boolean = false,
  ): GameTitleAbbreviation | string {
    switch (title) {
      case GameTitle.FH5:
        return GameTitleAbbreviation.FH5;
      case GameTitle.FM8:
        return GameTitleAbbreviation.FM8;
      case GameTitle.FH4:
        return GameTitleAbbreviation.FH4;
      case GameTitle.FM7:
        return GameTitleAbbreviation.FM7;
      case GameTitle.FH3:
        return GameTitleAbbreviation.FH3;
      default:
        if (shouldPassthruUnknownValues) {
          return title;
        }
        throw new Error(`Invalid game title provided to abbreviation pipe: ${title}`);
    }
  }
}
