import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { GravityGiftHistoryComponent } from './gravity-gift-history.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gift-history.state.actions';

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
        providers: [createMockMsalService()],
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

  describe('Method: onPlayerIdentitiesChange', () => {
    let event: IdentityResultAlphaBatch;
    beforeEach(() => {
      event = [
        {
          query: undefined,
          xuid: BigInt(123456789),
        },
      ];
    });
    it('should displatch SetGravitySelectedPlayerIdentities with correct data', () => {
      component.onPlayerIdentitiesChange(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetGravitySelectedPlayerIdentities(event),
      );
    });
  });
});
