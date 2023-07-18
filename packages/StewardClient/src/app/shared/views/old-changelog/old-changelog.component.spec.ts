import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { Store } from '@ngxs/store';
import { SetAppVersion } from '@shared/state/user-settings/user-settings.actions';
import { OldChangelogComponent } from './old-changelog.component';

describe('OldChangelogComponent', () => {
  let fixture: ComponentFixture<OldChangelogComponent>;
  let component: OldChangelogComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadata({ declarations: [OldChangelogComponent] }),
    ).compileComponents();

    fixture = TestBed.createComponent(OldChangelogComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
  }));

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
