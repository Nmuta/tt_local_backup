import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { ToolsAvailability } from '@models/blob-storage';
import { BlobStorageService } from '@services/blob-storage';
import { SettingsService } from '@services/settings';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';

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
  public setToolsAvailabilityMonitor = new ActionMonitor('POST tools availability');
  public featureSupported: boolean = false;

  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly settingsService: SettingsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.featureSupported = environment.production;

    if (!this.featureSupported) {
      return;
    }

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
  public toggleAllToolsAvailability(event: MatSlideToggleChange): void {
    if (!this.featureSupported) {
      return;
    }

    this.setToolsAvailabilityMonitor = new ActionMonitor(
      this.setToolsAvailabilityMonitor.dispose().label,
    );

    this.settingsService
      .setToolAvailability$({ allTools: event.checked })
      .pipe(
        this.setToolsAvailabilityMonitor.monitorSingleFire(),
        catchError(_error => {
          this.getToolsAvailability$.next();
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(updatedToolsAvailability => {
        this.toolsAvailability = updatedToolsAvailability;
      });
  }
}
