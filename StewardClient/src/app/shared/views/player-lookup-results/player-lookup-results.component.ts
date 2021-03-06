import { Component, Input } from '@angular/core';
import { IdentityResultUnion } from '@models/identity-query.model';

@Component({
  selector: 'player-lookup-results',
  templateUrl: './player-lookup-results.component.html',
  styleUrls: ['./player-lookup-results.component.scss']
})
export class PlayerLookupResultsComponent{
@Input() identity: IdentityResultUnion;

}
