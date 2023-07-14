import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { keys } from 'lodash';
import { ModelDumpChildBaseComponent } from '../helpers/model-dump-child.base.component';

/**
 * Renders a table of all source data that looks like a XUID.
 */
@Component({
  selector: 'model-dump-xuids',
  templateUrl: './model-dump-xuids.component.html',
  styleUrls: ['./model-dump-xuids.component.scss'],
})
export class ModelDumpXuidsComponent extends ModelDumpChildBaseComponent implements OnInit {
  private readonly allTitles: string[] = keys(GameTitle).map(x => GameTitle[x]);
  public playerDetailsRoute: string = '/app/tools/user-details';

  constructor(protected readonly injector: Injector, private readonly location: Location) {
    super(injector);
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    super.ngOnInit();

    const routePath = this.location.path();
    const foundTitle = this.allTitles.find(title => {
      return routePath.includes(title);
    });

    if (!!foundTitle) {
      this.playerDetailsRoute += `/${foundTitle}`;
    }
  }
}
