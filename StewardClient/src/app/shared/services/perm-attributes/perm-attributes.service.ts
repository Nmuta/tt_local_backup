import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { UserModel } from '@models/user.model';
import { includes } from 'lodash';

type TitlesAndEnvironments = {
  [key in string]: string[];
};

/** Convenience service for managing user's perm attributes. */
@Injectable({
  providedIn: 'root',
})
export class PermAttributesService {
  private availableTitlesAndEnvironments: TitlesAndEnvironments = {
    [GameTitle.FM8]: [],
    [GameTitle.FM7]: [],
    [GameTitle.FH5]: [],
    [GameTitle.FH4]: [],
  };

  public get hasSteelheadAccess(): boolean {
    return this.availableTitlesAndEnvironments[GameTitle.FM8].length > 0;
  }

  public get hasApolloAccess(): boolean {
    return this.availableTitlesAndEnvironments[GameTitle.FM7].length > 0;
  }

  public get hasWoodstockAccess(): boolean {
    return this.availableTitlesAndEnvironments[GameTitle.FH5].length > 0;
  }

  public get hasSunriseAccess(): boolean {
    return this.availableTitlesAndEnvironments[GameTitle.FH4].length > 0;
  }

  public get steelheadEnvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FM8];
  }

  public get apollonvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FM7];
  }

  public get woodstocknvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FH5];
  }

  public get sunrisenvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FH4];
  }

  /** Initiallizes the parm attributes service. */
  public initialize(user: UserModel): void {
    const attributes = user.attributes;

    // Build the available titles and environments model
    for (const attribute of attributes) {
      const title = attribute.title;
      const env = attribute.environment;

      if (this.isValidTitle(title)) {
        const environments: string[] = this.availableTitlesAndEnvironments[title];
        if (!includes(environments, env)) {
          environments.push(env);
        }

        this.availableTitlesAndEnvironments[title] = environments;
      }
    }
  }

  private isValidTitle(title: string): boolean {
    return !!title && title in this.availableTitlesAndEnvironments;
  }
}
