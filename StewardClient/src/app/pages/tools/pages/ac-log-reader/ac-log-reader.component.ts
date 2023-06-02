import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';

/** AC Log Reader page. */
@Component({
  templateUrl: './ac-log-reader.component.html',
  styleUrls: ['./ac-log-reader.component.scss'],
})
export class AcLogReaderComponent extends BaseComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;

  constructor() {
    super();
  }
}
