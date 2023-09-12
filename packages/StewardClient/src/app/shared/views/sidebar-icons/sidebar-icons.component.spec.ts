import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { SidebarIconsComponent } from './sidebar-icons.component';
import { environment } from '@environments/environment';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { createMockUserSettingsService } from '@shared/state/user-settings/use-settings.service.mock';
import { createMockChangelogService } from '@services/changelog/changelog.service.mock';
import { ChangelogService } from '@services/changelog/changelog.service';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { NotificationsService } from '@shared/hubs/notifications.service';
import { BackgroundJob } from '@models/background-job';
import { Subject } from 'rxjs';
import { sidebarRoutes } from 'app/sidebars/sidebars.routing';
import { Router } from '@angular/router';

describe('SidebarIconsComponent', () => {
  let fixture: ComponentFixture<SidebarIconsComponent>;
  let component: SidebarIconsComponent;
  let router: Router;

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
        routes: [...sidebarRoutes],
      }),
    ).compileComponents();

    router = TestBed.inject(Router);
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

      it('should not open the changelog sidebar', fakeAsync(() => {
        component.ngAfterViewInit();
        tick();
        expect(router.url).not.toContain('unified/changelog');
      }));
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

        it('should not open the changelog sidebar', fakeAsync(() => {
          component.ngAfterViewInit();

          tick();
          expect(router.url).not.toContain('unified/changelog');
        }));
      });

      describe('And it does not match the environment version', () => {
        beforeEach(() => {
          environment.adoVersion = testAdoVerion;
        });

        describe('And disableAutomaticPopup is false', () => {
          beforeEach(() => {
            spyOnChangelogServicesDisablePopup.and.returnValue(false);
          });

          it('should not open the changelog sidebar when there are no changes', fakeAsync(() => {
            spyOnProperty(mockChangelogService, 'allAreAcknowledged', 'get').and.returnValue(true);
            spyOnProperty(mockChangelogService, 'allArePending', 'get').and.returnValue(false);
            component.ngAfterViewInit();

            tick();
            expect(router.url).not.toContain('unified/changelog');
          }));

          it('should open the changelog sidebar when there are changes', fakeAsync(() => {
            spyOnProperty(mockChangelogService, 'allAreAcknowledged', 'get').and.returnValue(false);
            spyOnProperty(mockChangelogService, 'allArePending', 'get').and.returnValue(false);
            component.ngAfterViewInit();

            tick();
            expect(router.url).toContain('unified/changelog');
          }));
        });

        describe('And disableAutomaticPopup is true', () => {
          beforeEach(() => {
            spyOnChangelogServicesDisablePopup.and.returnValue(true);
          });

          it('should not open the changelog sidebar', fakeAsync(() => {
            component.ngAfterViewInit();

            tick();
            expect(router.url).not.toContain('unified/changelog');
          }));
        });
      });
    });
  });
});
