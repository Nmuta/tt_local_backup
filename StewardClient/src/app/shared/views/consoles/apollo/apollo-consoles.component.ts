import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { ApolloService } from '@services/apollo';
import { Observable, throwError } from 'rxjs';
import { ConsolesBaseComponent } from '../consoles.base.component';
import { PermissionsService } from '@services/permissions';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'apollo-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class ApolloConsolesComponent extends ConsolesBaseComponent<ApolloConsoleDetailsEntry> {
  public gameTitle = GameTitleCodeName.FM7;
  public supportsConsoleBanning = false;

  constructor(
    private readonly apolloService: ApolloService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<ApolloConsoleDetailsEntry[]> {
    return this.apolloService.getConsoleDetailsByXuid$(xuid);
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction$(_consoleId: string): () => Observable<void> {
    return () => throwError(new Error('Apollo does not support console banning.'));
  }

  /** Generates a function that will *unban* the user and update data when complete. */
  public makeUnbanAction$(_consoleId: string): () => Observable<void> {
    return () => throwError(new Error('Apollo does not support console banning.'));
  }
}
