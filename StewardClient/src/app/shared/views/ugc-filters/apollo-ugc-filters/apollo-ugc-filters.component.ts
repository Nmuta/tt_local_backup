import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { UgcFiltersBaseComponent } from '../ugc-filters.base.component';

/** Component for Apollo UGC filters. */
@Component({
  selector: 'apollo-ugc-filters',
  templateUrl: './apollo-ugc-filters.component.html',
  styleUrls: ['./apollo-ugc-filters.component.scss'],
})
export class ApolloUgcFiltersComponent extends UgcFiltersBaseComponent {
  public gameTitle = GameTitleCodeName.FM7;
}
