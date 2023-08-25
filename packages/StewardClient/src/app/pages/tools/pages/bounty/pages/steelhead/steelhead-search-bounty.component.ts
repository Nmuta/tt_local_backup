import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BountySummary,
  SteelheadBountiesService,
} from '@services/api-v2/steelhead/bounties/steelhead-bounties.service';
import { orderBy, filter } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

/** Retreives and displays Steelhead bounties. */
@Component({
  selector: 'steelhead-search-bounty',
  templateUrl: './steelhead-search-bounty.component.html',
  styleUrls: ['./steelhead-search-bounty.component.scss'],
})
export class SteelheadSearchBountyComponent extends BaseComponent implements OnInit {
  public gameTitle = GameTitle.FM8;

  public getMonitor = new ActionMonitor('GET Bounty Summaries');
  public bountySummaries = new MatTableDataSource<BountySummary>();
  public bountySummariesData: BountySummary[];
  public columnsToDisplay = ['rivalsInfo', 'bountyInfo', 'actions'];

  public formControls = {
    keyword: new FormControl(''),
    rivalsEventId: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);

  constructor(private readonly steelheadBountiesService: SteelheadBountiesService) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getMonitor = this.getMonitor.repeat();
    this.steelheadBountiesService
      .getBountySummaries$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(bountySummaries => {
        this.bountySummariesData = bountySummaries;
        this.bountySummaries.data = orderBy(
          bountySummaries,
          content => content.rivalsEventId,
          'desc',
        );
      });
  }

  /** Sets keyword entered as the data table filter. */
  public search(): void {
    this.bountySummaries.filter = this.formControls.keyword.value;
  }

  /** Filter by rivals event id.  */
  public filterByRivalsId(): void {
    this.bountySummaries.data = filter(
      this.bountySummariesData,
      bounty => bounty.rivalsEventId == this.formControls.rivalsEventId.value,
    );
  }
}
