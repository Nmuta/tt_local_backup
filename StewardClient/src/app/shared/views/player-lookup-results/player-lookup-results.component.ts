import { Component, Input } from '@angular/core';
import { IdentityResultBeta, IdentityResultUnion } from '@models/identity-query.model';

@Component({
  selector: 'player-lookup-results',
  templateUrl: './player-lookup-results.component.html',
  styleUrls: ['./player-lookup-results.component.scss']
})
export class PlayerLookupResultsComponent{
  @Input() identity: IdentityResultUnion;

  /** The players Turn 10 ID. */
  public get t10Id(): string {
    return (this.identity as IdentityResultBeta)?.t10Id;
  }

  /** The players gamertag. */
  public get gamertag(): string {
    return this.identity?.gamertag;
  }

  /** The players XUID. */
  public get xuid(): bigint {
    return this.identity?.xuid;
  }
}
