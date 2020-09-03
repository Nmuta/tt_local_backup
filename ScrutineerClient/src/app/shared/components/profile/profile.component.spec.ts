import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { environment } from '@environments/environment';
import { ProfileComponent } from './profile.component';
import {
  WindowService,
  createMockWindowService,
} from '@shared/services/window';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';

describe('ProfileComponent', () => {
  let mockWindowService: WindowService;
  let mockRouter: Router;
  let mockStore: Store;

  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState])
      ],
      declarations: [ProfileComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        createMockMsalService()
      ],
    }).compileComponents();

    const injector = getTestBed();
    mockWindowService = injector.get(WindowService);
    mockRouter = injector.get(Router);
    mockStore = injector.get(Store);

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: openAuthPageInNewTab', () => {
    beforeEach(() => {
      mockWindowService.open = jasmine.createSpy('open');
    });
    it('should call windowService.open correctly', () => {
      component.logout();

      expect(mockWindowService.open).toHaveBeenCalledWith(
        `${environment.clientUrl}/auth?action=logout`,
        '_blank'
      );
    });
  });

  describe('Method: changeProfileTabVisibility', () => {
    describe('When profileTabVisible is false', () => {
      it('should call set profileTabVisible to true', () => {
        component.profileTabVisible = false;
        component.changeProfileTabVisibility();

        expect(component.profileTabVisible).toBeTruthy();
      });
    });
    describe('When profileTabVisible is true', () => {
      it('should call set profileTabVisible to false', () => {
        component.profileTabVisible = true;
        component.changeProfileTabVisibility();

        expect(component.profileTabVisible).toBeFalsy();
      });
    });
  });
});
