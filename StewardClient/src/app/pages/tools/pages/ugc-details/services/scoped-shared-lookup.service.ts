import { Injectable } from '@angular/core';
import { BaseService } from '@components/base-component/base.service';
import { ShareCodeOutputModel } from '@services/api-v2/all/ugc/find-models';
import { MultipleUgcFindService } from '@services/api-v2/all/ugc/find.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

/** A local service for shared lookup results of UGC Details. */
@Injectable()
export class ScopedSharedLookupService extends BaseService {
  public readonly getMonitor = new ActionMonitor('GET Find All UGC');

  private doLookup$ = new Subject<string>();
  public onLookup$: Observable<string> = this.doLookup$;
  public latestResults$: Observable<ShareCodeOutputModel> = new Subject<ShareCodeOutputModel>();
  public locations: ShareCodeOutputModel;

  /** True when the content has any result in FH5 */
  public get hasAnyFH5(): boolean {
    return !!this.locations?.fh5?.length;
  }

  /** True when the content has any result in FH4 */
  public get hasAnyFH4(): boolean {
    return !!this.locations?.fh4?.length;
  }

  constructor(private readonly findUgcService: MultipleUgcFindService) {
    super();

    this.doLookup$
      .pipe(
        this.getMonitor.monitorStart(),
        switchMap(id => this.findUgcService.getByShareCodeOrId$(id)),
        this.getMonitor.monitorCatch(),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(results => {
        this.locations = results;
        (this.latestResults$ as Subject<ShareCodeOutputModel>).next(this.locations);
      });
  }

  /** Performs the lookup. */
  public doLookup(id: string) {
    this.locations = null;
    (this.latestResults$ as Subject<ShareCodeOutputModel>).next(this.locations);

    if (id) {
      this.doLookup$.next(id);
    }
  }
}
