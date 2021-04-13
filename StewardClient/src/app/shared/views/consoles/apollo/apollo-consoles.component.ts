import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { GameTitleCodeName } from '@models/enums';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { ConsolesBaseComponent } from '../consoles.base.component';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'apollo-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class ApolloConsolesComponent extends ConsolesBaseComponent<ApolloConsoleDetailsEntry> {
  public gameTitle = GameTitleCodeName.FM7;
  public supportsConsoleBanning = false;

  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid(xuid: BigNumber): Observable<ApolloConsoleDetailsEntry[]> {
    return this.apolloService.getConsoleDetailsByXuid(xuid);
  }
}
