import { Store } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarIconsComponent } from './sidebar-icons.component';
import { environment } from '@environments/environment';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';

describe('SidebarIconsComponent', () => {
  let fixture: ComponentFixture<SidebarIconsComponent>;
  let component: SidebarIconsComponent;

  let mockStore: Store;
  let appVersionReturnValue: string;
  let showAppUpdatePopupReturnValue: boolean;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [SidebarIconsComponent],
        imports: [MatMenuModule, MatDialogModule, BrowserAnimationsModule],
      }),
    ).compileComponents();

    TestBed.inject(MatDialog).open = jasmine.createSpy('open');
    fixture = TestBed.createComponent(SidebarIconsComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.callFake(param => {
      if (param === UserSettingsState.appVersion) return appVersionReturnValue;
      if (param === UserSettingsState.showAppUpdatePopup) return showAppUpdatePopupReturnValue;
      return null;
    });
  }));

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
        appVersionReturnValue = undefined;
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
        appVersionReturnValue = testAdoVerion;
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

        describe('And showAppUpdatePopup is true', () => {
          beforeEach(() => {
            showAppUpdatePopupReturnValue = true;
          });

          it('should not add o the settingsNotificationCount', () => {
            component.ngOnInit();

            expect(component.settingsNotificationCount).toEqual(0);
          });
        });

        describe('And showAppUpdatePopup is false', () => {
          beforeEach(() => {
            showAppUpdatePopupReturnValue = false;
          });

          it('should add one to the settingsNotificationCount', () => {
            component.ngOnInit();

            expect(component.settingsNotificationCount).toEqual(
              defaultSettingsNotificationCount + 1,
            );
          });
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
