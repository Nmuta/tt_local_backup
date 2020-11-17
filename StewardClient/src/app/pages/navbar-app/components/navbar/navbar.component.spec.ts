import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import {
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { UserModel } from '@shared/models/user.model';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { NavbarComponent } from './navbar.component';
import { createMockWindowService } from '@services/window';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let mockRouter: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [NavbarComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWindowService(), createMockMsalService()],
      }).compileComponents();

      const injector = getTestBed();
      mockRouter = injector.inject(Router);

      fixture = TestBed.createComponent(NavbarComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
