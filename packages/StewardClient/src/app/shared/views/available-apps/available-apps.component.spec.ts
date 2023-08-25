import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { of } from 'rxjs';

import { AvailableAppsComponent } from './available-apps.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

describe('AvailableAppsComponent', () => {
  let component: AvailableAppsComponent;
  let fixture: ComponentFixture<AvailableAppsComponent>;

  let mockStore: Store;
  let mockWindowService: WindowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [AvailableAppsComponent],
        imports: [TourMatMenuModule],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(AvailableAppsComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of(<UserSettingsStateModel>{
      enableFakeApi: false,
    });

    mockStore = TestBed.inject(Store);
    mockWindowService = TestBed.inject(WindowService);

    mockStore.dispatch = jasmine.createSpy('dispatch');
    mockWindowService.location = jasmine
      .createSpy('location')
      .and.returnValue({ origin: 'http://microsoft.test' });

    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot');
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
