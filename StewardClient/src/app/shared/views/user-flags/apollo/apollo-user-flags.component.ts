import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitleCodeName } from '@models/enums';
import { ApolloService } from '@services/apollo';
import { ApolloUserFlags } from '@models/apollo';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'apollo-user-flags',
  templateUrl: './apollo-user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class ApolloUserFlagsComponent extends UserFlagsBaseComponent<ApolloUserFlags> {
  public gameTitle = GameTitleCodeName.FM7;

  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Gets Apollo user flags. */
  public getFlagsByXuid(xuid: bigint): Observable<ApolloUserFlags> {
    return this.apolloService.getFlagsByXuid(xuid);
  }

  /** Sets the newly selected Apollo flags. */
  public putFlagsByXuid(xuid: bigint, newFlags: ApolloUserFlags): Observable<ApolloUserFlags> {
    return this.apolloService.putFlagsByXuid(xuid, newFlags);
  }
}
