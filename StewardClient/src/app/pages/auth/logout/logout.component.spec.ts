import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MsalService } from '@azure/msal-angular';
import { environment } from '@environments/environment';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { Navigate } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import {
  createMockWindowService,
  MockWindowService,
  WindowOpen,
  WindowService,
} from '@services/window';

import { LogoutComponent } from './logout.component';

describe('LogoutComponent:', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let windowService: MockWindowService;
  let store: Store;
  let msal: MsalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [LogoutComponent],
      providers: [...createMockMsalServices(), createMockWindowService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(Store);
    store.dispatch = jasmine.createSpy('store.dispatch');
    msal = TestBed.inject(MsalService);
    windowService = (TestBed.inject(WindowService) as unknown) as MockWindowService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when inside iframe:', () => {
    beforeEach(() => {
      windowService.isInIframe = true;
    });

    it('should redirect and open new window', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith([
        new WindowOpen(`${environment.stewardUiUrl}/auth/logout`, '_blank'),
        new Navigate(['/auth/logout-iframe']),
      ]);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('when outside iframe:', () => {
    beforeEach(() => {
      windowService.isInIframe = false;
    });

    it('should invoke msal', () => {
      fixture.detectChanges();
      expect(msal.logout).toHaveBeenCalledTimes(1);
    });
  });
});
