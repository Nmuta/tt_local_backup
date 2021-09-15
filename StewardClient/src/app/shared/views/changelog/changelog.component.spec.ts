import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@environments/environment';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { ChangelogComponent } from './changelog.component';

describe('ChangelogComponent', () => {
  let fixture: ComponentFixture<ChangelogComponent>;
  let component: ChangelogComponent;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserSettingsState]),
        ],
        declarations: [ChangelogComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          ...createMockMsalServices(),
          createMockZendeskService(),
          createMockLoggerService(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ChangelogComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    const environmentAdoVerion: string = 'env-ado-verion';
    const storedAdoVerion: string = 'stored-ado-verion';
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch');
      mockStore.selectSnapshot = jasmine
        .createSpy('selectSnapshot')
        .and.returnValue(storedAdoVerion);
      environment.adoVersion = environmentAdoVerion;
    });

    it('should dispatch the SetAppVersion store action', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetAppVersion(environmentAdoVerion));
    });

    describe('When the stored app version matches the environment app version', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(storedAdoVerion);
        environment.adoVersion = storedAdoVerion;
      });

      it('should set clientOnNewVersion to false', () => {
        component.ngOnInit();

        expect(component.clientOnNewVersion).toBeFalsy();
      });
    });

    describe('When the storex app version does not match the environment app version', () => {
      beforeEach(() => {
        mockStore.selectSnapshot = jasmine
          .createSpy('selectSnapshot')
          .and.returnValue(storedAdoVerion);
        environment.adoVersion = environmentAdoVerion;
      });

      it('should set clientOnNewVersion to true', () => {
        component.ngOnInit();

        expect(component.clientOnNewVersion).toBeTruthy();
      });
    });
  });
});
