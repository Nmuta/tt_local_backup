import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SidebarIconsComponent } from './sidebar-icons.component';
import { environment } from '@environments/environment';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { createMockUserSettingsService } from '@shared/state/user-settings/use-settings.service.mock';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';
import { ChangelogService } from '@services/changelog/changelog.service';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { BackgroundJob } from '@models/background-job';
import { Subject } from 'rxjs';

describe('SidebarIconsComponent', () => {
  let fixture: ComponentFixture<SidebarIconsComponent>;
  let component: SidebarIconsComponent;

  let mockChangelogService: ChangelogService;
  let mockUserSettingsService: UserSettingsService;
  let mockNotificationsService: NotificationsService;

  let spyOnSettingsStateAppVersion: jasmine.Spy;
  let spyOnChangelogServicesDisablePopup: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [SidebarIconsComponent],
        imports: [MatMenuModule, MatDialogModule, BrowserAnimationsModule],
        providers: [createMockUserSettingsService(), createMockChangelogService()],
      }),
    ).compileComponents();

    TestBed.inject(MatDialog).open = jasmine.createSpy('open');
    fixture = TestBed.createComponent(SidebarIconsComponent);
    component = fixture.debugElement.componentInstance;

    mockChangelogService = TestBed.inject(ChangelogService);
    spyOnChangelogServicesDisablePopup = spyOnProperty(
      mockChangelogService,
      'disableAutomaticPopup',
      'get',
    );
    spyOnChangelogServicesDisablePopup.and.returnValue(false);

    mockUserSettingsService = TestBed.inject(UserSettingsService);
    spyOnSettingsStateAppVersion = spyOnProperty(mockUserSettingsService, 'appVersion', 'get');
    spyOnSettingsStateAppVersion.and.returnValue(undefined);

    mockNotificationsService = TestBed.inject(NotificationsService);
    mockNotificationsService.initialize = jasmine.createSpy('initialize');
    mockNotificationsService.notifications$ = new Subject<BackgroundJob<unknown>[]>();

    component.changelogLink = {
      nativeElement: {
        click: () => {
          return;
        },
      },
    };

    component.changelogLink.nativeElement.click = jasmine.createSpy('changelogLinkClick');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngAfterViewInit', () => {
    it('should call notificationsService.initialize()', () => {
      component.ngAfterViewInit();

      expect(mockNotificationsService.initialize).toHaveBeenCalled();
    });
  });

  describe('Method: ngAfterViewInit', () => {
    describe('When the app version is undefined', () => {
      const environmentAdoVerion: string = 'env-ado-verion';

      beforeEach(() => {
        spyOnSettingsStateAppVersion.and.returnValue(undefined);
        environment.adoVersion = environmentAdoVerion;
      });

      it('should not open the changelog sidebar', () => {
        component.ngAfterViewInit();

        expect(component.changelogLink.nativeElement.click).not.toHaveBeenCalled();
      });
    });

    describe('When the app version is defined', () => {
      const testAdoVerion: string = 'test-ado-verion';
      const oldtAdoVerion: string = 'old-ado-verion';
      const defaultSettingsNotificationCount = 0;

      beforeEach(() => {
        spyOnSettingsStateAppVersion.and.returnValue(oldtAdoVerion);
        component.settingsNotificationCount = defaultSettingsNotificationCount;
      });

      describe('And it matches the environment version', () => {
        beforeEach(() => {
          environment.adoVersion = oldtAdoVerion;
        });

        it('should not open the changelog sidebar', () => {
          component.ngAfterViewInit();

          expect(component.changelogLink.nativeElement.click).not.toHaveBeenCalled();
        });
      });

      describe('And it does not match the environment version', () => {
        beforeEach(() => {
          environment.adoVersion = testAdoVerion;
        });

        describe('And disableAutomaticPopup is false', () => {
          beforeEach(() => {
            spyOnChangelogServicesDisablePopup.and.returnValue(false);
          });

          it('should open the changelog sidebar', () => {
            component.ngAfterViewInit();

            expect(component.changelogLink.nativeElement.click).toHaveBeenCalled();
          });
        });

        describe('And disableAutomaticPopup is true', () => {
          beforeEach(() => {
            spyOnChangelogServicesDisablePopup.and.returnValue(true);
          });

          it('should not open the changelog sidebar', () => {
            component.ngAfterViewInit();

            expect(component.changelogLink.nativeElement.click).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
