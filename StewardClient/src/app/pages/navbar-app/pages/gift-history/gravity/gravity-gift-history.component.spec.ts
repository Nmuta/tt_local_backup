import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { GravityGiftHistoryComponent } from './gravity-gift-history.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';

describe('GravityGiftHistoryComponent', () => {
  let component: GravityGiftHistoryComponent;
  let fixture: ComponentFixture<GravityGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, GravityGiftHistoryState]),
        ],
        declarations: [GravityGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(GravityGiftHistoryComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('Method: onPlayerIdentityChange', () => {
  //   let event: IdentityResultAlpha;
  //   beforeEach(() => {
  //     event =
  //       {
  //         query: undefined,
  //         xuid: BigInt(123456789),
  //       };
  //   });
  //   it('should displatch SetGravitySelectedPlayerIdentities with correct data', () => {
  //     component.onPlayerIdentityChange(event);

  //     expect(mockStore.dispatch).toHaveBeenCalledWith(
  //       new SetGravitySelectedPlayerIdentities(event),
  //     );
  //   });
  // });
});
