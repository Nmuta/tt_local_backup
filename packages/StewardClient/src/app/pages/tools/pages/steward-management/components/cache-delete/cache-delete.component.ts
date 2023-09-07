import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { CacheService } from '@services/settings/cache/cache.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { take, takeUntil } from 'rxjs';

/** Displays the cache delete tool. */
@Component({
  selector: 'cache-delete',
  templateUrl: './cache-delete.component.html',
  styleUrls: ['./cache-delete.component.scss'],
})
export class CacheDeleteComponent extends BaseComponent {
  public formControls = {
    cacheKey: new UntypedFormControl('', Validators.required),
  };
  public formGroup = new UntypedFormGroup(this.formControls);

  public deleteMonitor = new ActionMonitor(null);

  constructor(private readonly cacheService: CacheService) {
    super();
  }

  /** Deletes the cache key. */
  public deleteCacheKey(): void {
    const cacheKey = this.formControls.cacheKey.value;
    if (cacheKey?.trim() === '') {
      return;
    }

    this.deleteMonitor.dispose();
    this.deleteMonitor = new ActionMonitor(`Delete cache key: ${cacheKey}`);

    this.cacheService
      .deleteCacheKey$(cacheKey)
      .pipe(take(1), this.deleteMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }
}
