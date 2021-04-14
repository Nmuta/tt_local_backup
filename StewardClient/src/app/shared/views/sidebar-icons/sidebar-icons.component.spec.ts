import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { SidebarIconsComponent } from './sidebar-icons.component';
import { environment } from '@environments/environment';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

describe('SidebarIconsComponent', () => {
  let fixture: ComponentFixture<SidebarIconsComponent>;
  let component: SidebarIconsComponent;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserSettingsState]),
        ],
        declarations: [SidebarIconsComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockZendeskService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SidebarIconsComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch');
    });

    describe('When the store app settings is undefined', () => {
      const environmentAdoVerion: string = 'env-ado-verion';

      beforeEach(() => {
        mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue(undefined);
        environment.adoVersion = environmentAdoVerion;
      });

      it('should dispatch the SetAppVersion store action', () => {
        component.ngOnInit();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new SetAppVersion(environmentAdoVerion));
      });
    });

    describe('When the store app settings is defined', () => {
      const testAdoVerion: string = 'test-ado-verion';
      const oldtAdoVerion: string = 'old-ado-verion';
      const defaultSettingsNotificationCount = 0;

      beforeEach(() => {
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(testAdoVerion);
        component.settingsNotificationCount = defaultSettingsNotificationCount;
      });

      it('should not dispatch the SetAppVersion store action', () => {
        component.ngOnInit();

        expect(mockStore.dispatch).not.toHaveBeenCalled();
      });

      describe('And it matches the environment version', () => {
        beforeEach(() => {
          environment.adoVersion = testAdoVerion;
        });

        it('should not add to the the settingsNotificationCount', () => {
          component.ngOnInit();

          expect(component.settingsNotificationCount).toEqual(defaultSettingsNotificationCount);
        });
      });

      describe('And it does not match the environment version', () => {
        beforeEach(() => {
          environment.adoVersion = oldtAdoVerion;
        });

        it('should add one to the settingsNotificationCount', () => {
          component.ngOnInit();

          expect(component.settingsNotificationCount).toEqual(defaultSettingsNotificationCount + 1);
        });
      });
    });
  });

  describe('Method: clickedSettings', () => {
    it('should set settingsNotificationCount to zero', () => {
      component.settingsNotificationCount = 10;
      expect(component.settingsNotificationCount).toEqual(10);

      component.clickedSettings();

      expect(component.settingsNotificationCount).toEqual(0);
    });
  });
});
