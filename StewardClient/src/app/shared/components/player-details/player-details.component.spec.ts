import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';
import { environment } from '@environments/environment';
import { PlayerDetailsComponent } from './player-details.component';
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
import {
  ResetUserProfile,
  ResetAccessToken,
} from '@shared/state/user/user.actions';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let mockWindowService: WindowService;
  let mockRouter: Router;
  let mockStore: Store;

  let fixture: ComponentFixture<PlayerDetailsComponent>;
  let component: PlayerDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      declarations: [PlayerDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockWindowService(), createMockMsalService()],
    }).compileComponents();

    const injector = getTestBed();
    mockWindowService = injector.get(WindowService);
    mockRouter = injector.get(Router);
    mockStore = injector.get(Store);

    fixture = TestBed.createComponent(PlayerDetailsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
