import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { JsonTableResult } from '@models/json-table-result';
import { ServicesTableStorageEntity } from '@services/api-v2/steelhead/services-table-storage/services-table-storage.service';
import { ObjectEntry } from '@shared/modules/model-dump/helpers';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { keys, uniq } from 'lodash';
import { map, Observable, startWith, takeUntil } from 'rxjs';

/** Upstream contract for Services Table Storage. */
export interface ServicesTableStorageContract {
  gameTitle: GameTitle;
  xuid: BigNumber;
  externalProfileId: GuidLikeString;
  getTableStorageByProfileId$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
  ): Observable<ServicesTableStorageEntity[]>;
}

/** The home page to rule them all. */
@Component({
  selector: 'services-filterable-table',
  templateUrl: './services-filterable-table.component.html',
  styleUrls: ['./services-filterable-table.component.scss'],
})
export class ServicesFilterableTableComponent extends BaseComponent implements OnChanges {
  /** Service Contract. */
  @Input() public contract: ServicesTableStorageContract;

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;

  public tableData: JsonTableResult<ServicesTableStorageEntity>[] = [];
  public filteredTableData: JsonTableResult<ServicesTableStorageEntity>[] = [];
  public filters: string[] = [];

  public categoryControl = new FormControl('');
  public categories: string[] = [];
  public filteredCategories: Observable<string[]>;

  public getMonitor: ActionMonitor = new ActionMonitor('Get Table Storage');

  constructor() {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(): void {
    if (!this.contract) {
      throw new Error('Service Contract could not be found for Services Table Storage component.');
    }

    this.filteredCategories = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCategories(value || '')),
    );
  }

  /** Finds the table storage etries based on xuid/profileId. */
  public lookup(): void {
    if (!this.contract) {
      throw new Error('Missing Service Contract');
    }

    this.getMonitor = this.getMonitor.repeat();
    this.contract
      .getTableStorageByProfileId$(this.contract?.xuid, this.contract?.externalProfileId)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(results => {
        const data = results;

        data.forEach(entity => {
          const preparedProperties: ObjectEntry<unknown>[] = [];
          keys(entity.properties).forEach(key => {
            preparedProperties.push({
              key: key,
              name: key,
              shortName: key,
              value: entity.properties[key],
            });
          });
          entity.preparedProperties = preparedProperties;
        });

        this.categories = uniq(
          data.map(entity => entity.rowKey.substring(0, entity.rowKey.indexOf('_'))),
        );

        this.filteredCategories = this.categoryControl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterCategories(value || '')),
        );

        this.tableData = data.map(entity => {
          return {
            rowKey: entity.rowKey,
            partitionKey: entity.partitionKey,
            timestampUtc: entity.timestampUtc,
            properties: entity.properties,
            preparedProperties: entity.preparedProperties,
            showErrorInTable: false,
          } as JsonTableResult<ServicesTableStorageEntity>;
        });

        this.filterTableData();
      });
  }

  /** Remove all filters. */
  public clearFilters(): void {
    this.filters = [];
    this.filterTableData();
  }

  /** Remove filter. */
  public removeFilter(filter: string): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.filterTableData();
    }
  }

  /** Select filter to add. */
  public selectedFilter(event: MatAutocompleteSelectedEvent): void {
    const selectedFilter = event.option.value;
    const alreadyAdded = this.filters.some(filter => filter === selectedFilter);

    //Don't add duplicate filters
    if (alreadyAdded) {
      this.categoryControl.setValue(null);

      return;
    }

    this.filters.push(selectedFilter);
    this.filterTableData();

    //clear the input value
    this.categoryControl.setValue(null);
  }

  /** Apply filters to table data. */
  public filterTableData(): null {
    if (this.filters.length <= 0) {
      this.filteredTableData = this.tableData;
      return;
    }

    this.filteredTableData = this.tableData.filter(data => {
      return this.filters.some(filter => {
        return data.rowKey.includes(filter);
      });
    });
  }

  private filterCategories(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(option => option.toLowerCase().includes(filterValue));
  }
}
