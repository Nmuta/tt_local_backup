import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { environment } from '@environments/environment';
import { Select } from '@ngxs/store';
import { ChangelogService } from '@services/changelog/changelog.service';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { Observable, takeUntil } from 'rxjs';

/** Handles the unified sidebar selector. */
@Component({
  templateUrl: './sidebars.component.html',
  styleUrls: ['./sidebars.component.scss']
})
export class SidebarsComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('changelogLink', { read: ElementRef }) changelogLink: ElementRef;
  @Select(ChangelogState.allPendingIds) public allPendingIds$: Observable<string[]>;
  public changelogNotificationCount = 0;

  constructor(
    private readonly userSettingsService: UserSettingsService,
    private readonly changelogService: ChangelogService,
    protected dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    if (!!this.userSettingsService.appVersion) {
      const currentVersion = environment.adoVersion;
      const isNewAppVersion = currentVersion !== this.userSettingsService.appVersion;
      if (isNewAppVersion) {
        if (!this.changelogService.disableAutomaticPopup) {
          this.changelogLink?.nativeElement?.click();
        }
      }
    } else {
      this.userSettingsService.appVersion = environment.adoVersion;
    }

    this.allPendingIds$.pipe(takeUntil(this.onDestroy$)).subscribe(v => {
      this.changelogNotificationCount = v?.length ?? 0;
    });
  }
}
