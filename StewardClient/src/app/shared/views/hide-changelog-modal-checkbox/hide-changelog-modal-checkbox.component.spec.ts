import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { ConfigureAppUpdatePopup } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { of } from 'rxjs';
import { HideChangelogModalCheckboxComponent } from './hide-changelog-modal-checkbox.component';

describe('HideChangelogModalCheckboxComponent', () => {
  let fixture: ComponentFixture<HideChangelogModalCheckboxComponent>;
  let component: HideChangelogModalCheckboxComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserSettingsState]),
      ],
      declarations: [HideChangelogModalCheckboxComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        ...createMockMsalServices(),
        createMockZendeskService(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HideChangelogModalCheckboxComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
    Object.defineProperty(component, 'showAppUpdatePopup$', { writable: true });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('If showAppUpdatePopup$ outputs undefined', () => {
      beforeEach(() => {
        component.showAppUpdatePopup$ = of(undefined);
      });

      it('should call store.dispatch with correct params', () => {
        component.ngOnInit();

        expect(mockStore.dispatch).toHaveBeenCalledWith(new ConfigureAppUpdatePopup(true));
      });

      it('should set showAppUpdatePopup to true', () => {
        component.ngOnInit();

        expect(component.showAppUpdatePopup).toBeTruthy();
      });
    });

    describe('If showAppUpdatePopup$ outputs a boolean', () => {
      beforeEach(() => {
        component.showAppUpdatePopup$ = of(false);
        component.showAppUpdatePopup = true;
      });

      it('should set showAppUpdatePopup correct', () => {
        component.ngOnInit();

        expect(component.showAppUpdatePopup).toBeFalsy();
      });
    });
  });
});
