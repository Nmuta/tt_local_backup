import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { OpusGiftHistoryComponent } from './opus-gift-history.component';
import { OpusGiftHistoryState } from './state/opus-gift-history.state';
import { SetOpusGiftHistorySelectedPlayerIdentities } from './state/opus-gift-history.state.actions';

describe('OpusGiftHistoryComponent', () => {
  let component: OpusGiftHistoryComponent;
  let fixture: ComponentFixture<OpusGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, OpusGiftHistoryState]),
        ],
        declarations: [OpusGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(OpusGiftHistoryComponent);
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
    it('should displatch SetOpusGiftHistorySelectedPlayerIdentities with correct data', () => {
      component.onPlayerIdentitiesChange(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetOpusGiftHistorySelectedPlayerIdentities(event),
      );
    });
  });
});
