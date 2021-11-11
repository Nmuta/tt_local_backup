import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BaseComponent } from '@components/base-component/base.component';
import { ToolsAvailability } from '@models/blob-storage';
import { BlobStorageService } from '@services/blob-storage';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Displays the release management tool. */
@Component({
  selector: 'release-management',
  templateUrl: './release-management.component.html',
  styleUrls: ['./release-management.component.scss'],
})
export class ReleaseManagementComponent extends BaseComponent implements OnInit {
  private readonly getToolsAvailability$ = new Subject();

  public toolsAvailability: ToolsAvailability;
  public getToolsAvailabilityMonitor = new ActionMonitor('GET tools availability');

  constructor(private readonly blobStorageService: BlobStorageService) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getToolsAvailability$
      .pipe(
        switchMap(() => {
          this.getToolsAvailabilityMonitor = new ActionMonitor(
            this.getToolsAvailabilityMonitor.dispose().label,
          );
          return this.blobStorageService
            .getToolAvailability$()
            .pipe(this.getToolsAvailabilityMonitor.monitorSingleFire());
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(toolsAvailability => {
        this.toolsAvailability = toolsAvailability;
      });

    this.getToolsAvailability$.next();
  }

  /** Change event when all tools availability changes */
  public toggleAllToolsAvailability(_event: MatSlideToggleChange): void {
    // TODO: Ask steward to update tools availability blob
  }
}
