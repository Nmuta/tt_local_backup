import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { Store } from '@ngxs/store';
import { ConfigureAppUpdatePopup } from '@shared/state/user-settings/user-settings.actions';
import { of } from 'rxjs';
import { HideChangelogModalCheckboxComponent } from './hide-changelog-modal-checkbox.component';

describe('HideChangelogModalCheckboxComponent', () => {
  let fixture: ComponentFixture<HideChangelogModalCheckboxComponent>;
  let component: HideChangelogModalCheckboxComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadata({ declarations: [HideChangelogModalCheckboxComponent] }),
    ).compileComponents();

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
