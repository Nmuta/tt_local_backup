import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { JSONBigInt } from '@helpers/json-bigint';
import { AuctionDetailsLinkGenerator } from '@helpers/link-generators';
import { toDateTime } from '@helpers/luxon';
import { DetailedCar } from '@models/detailed-car';
import { PlayerAuctionAction } from '@models/player-auction-action';
import { AuctionDataServiceContract } from '@views/auction-data/auction-data.component';
import { MakeModelAutocompleteServiceContract } from '@views/make-model-autocomplete/make-model-autocomplete/make-model-autocomplete.component';
import { chain, merge, sumBy, trim } from 'lodash';
import { DateTime } from 'luxon';

interface LogTableFilter {
  text?: string;
  dateStart?: DateTime;
  dateEnd?: DateTime;
  car?: DetailedCar;
}

/** Service contract for log-table component.*/
export interface LogTableServiceContract
  extends AuctionDataServiceContract,
    MakeModelAutocompleteServiceContract {}

/** Renders a table of auction actions. */
@Component({
  selector: 'auction-action-log-table',
  templateUrl: './log-table.component.html',
  styleUrls: ['./log-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuctionActionLogTableComponent
  extends BaseComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() public auctionLog: PlayerAuctionAction[] = [];
  @Input() public service: LogTableServiceContract;
  @Input() public linkGenerator: AuctionDetailsLinkGenerator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public formControls = {
    dateRangeStart: new FormControl(undefined),
    dateRangeEnd: new FormControl(undefined),
    makeModel: new FormControl(undefined),
  };
  public dateFormGroup = new FormGroup({
    dateRangeStart: this.formControls.dateRangeStart,
    dateRangeEnd: this.formControls.dateRangeEnd,
  });
  public filteredCar: DetailedCar = null;

  public filter: LogTableFilter = {};

  public dataSource: BetterMatTableDataSource<PlayerAuctionAction, LogTableFilter>;
  public auctionLogFrequenciesByDate: Record<string, number> = {};

  public columnsToDisplay = [
    'timeUtc',
    'isSuccess',
    'action',
    'auctionId',
    'message',
    'bidAmount',
    'spendAmount',
  ];

  public expandedElement: PlayerAuctionAction | null = null;

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.dataSource = new BetterMatTableDataSource(this.auctionLog);
    this.applyDateFilter();
    this.calculateActiveDates();

    this.dateFormGroup.valueChanges.subscribe(_ => {
      this.filter.dateStart = (this.formControls.dateRangeStart.value as DateTime)?.startOf('day');
      this.filter.dateEnd = (this.formControls.dateRangeEnd.value as DateTime)?.endOf('day');
      this.dataSource.betterFilter = this.filter;
    });
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    this.dataSource = new BetterMatTableDataSource(this.auctionLog);
    this.applyDateFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.calculateActiveDates();
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.calculateActiveDates();
  }

  /** Angular Material Table Filter Hook */
  public applyFilter(event?: Event): void {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.filter.text = filterValue;
      this.dataSource.betterFilter = this.filter;
    } else {
      this.dataSource.refilter();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Forces type for items. */
  public action(item: unknown): PlayerAuctionAction {
    return item as PlayerAuctionAction;
  }

  /** Programmatically determines the class of a given date tile. */
  public dateClass: MatCalendarCellClassFunction<DateTime> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const key = toDateTime(cellDate).startOf('day').toISODate();
      const frequency = this.auctionLogFrequenciesByDate[key];
      if (!!frequency) {
        return 'date-cell-highlight';
      }
    }

    return '';
  };

  /** Updates the filtered make-model. */
  public applyMakeModelFilter(detailedCar: DetailedCar): void {
    this.filteredCar = detailedCar;
    this.filter.car = detailedCar;
    this.dataSource.betterFilter = this.filter;
  }

  private applyDateFilter(): void {
    this.dataSource.betterFilterPredicate = (data, filter) => {
      const hasFilterText = !!filter?.text ? trim(filter.text) != '' : false;
      const textFilterMatches = hasFilterText
        ? JSONBigInt.stringify(data).includes(trim(filter.text))
        : true;
      const excludeDueToMake = this.filter?.car?.makeId
        ? !this.filter?.car?.makeId?.isEqualTo(data.carMake)
        : false;
      const excludeDueToModel = this.filter?.car?.id
        ? !this.filter?.car?.id?.isEqualTo(data.carId)
        : false;
      const carFilterMatches = !(excludeDueToMake || excludeDueToModel);

      // exclude things before start (if specified)
      if (!!filter?.dateStart && data.timeUtc < filter?.dateStart) {
        return false;
      }

      // exclude things after end (if specified)
      if (!!filter?.dateEnd && data.timeUtc > filter?.dateEnd) {
        return false;
      }

      // standard filter
      return textFilterMatches && carFilterMatches;
    };
  }

  private calculateActiveDates(): void {
    this.auctionLogFrequenciesByDate = chain(this.auctionLog)
      .map(v => {
        return { day: v.timeUtc.startOf('day').toISODate(), count: 1 };
      })
      .groupBy(v => v.day)
      .map(g => {
        return { [g[0].day]: sumBy(g, g2 => g2.count) };
      })
      .reduce((v, a) => merge(a, v), {})
      .value();
  }
}
