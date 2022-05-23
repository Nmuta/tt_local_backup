import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { environment } from '@environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { ChangelogService } from '@services/changelog/changelog.service';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';

/** A menu dropdown with links to all Steward Apps. */
@Component({
  selector: 'sidebar-icons',
  templateUrl: './sidebar-icons.component.html',
  styleUrls: ['./sidebar-icons.component.scss'],
})
export class SidebarIconsComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('changelogLink', { read: ElementRef }) changelogLink: ElementRef;
  @Select(ChangelogState.allPendingIds) public allPendingIds$: Observable<string[]>;
  public changelogNotificationCount = 0;
  public settingsNotificationCount = 0;

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
