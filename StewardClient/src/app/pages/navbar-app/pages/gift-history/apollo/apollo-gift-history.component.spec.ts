import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { ApolloGiftHistoryComponent } from './apollo-gift-history.component';
import { ApolloGiftHistoryState } from './state/apollo-gift-history.state';
import {
  SetApolloGiftHistoryMatTabIndex,
  SetApolloGiftHistorySelectedPlayerIdentities,
} from './state/apollo-gift-history.state.actions';

describe('ApolloGiftHistoryComponent', () => {
  let component: ApolloGiftHistoryComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, ApolloGiftHistoryState]),
        ],
        declarations: [ApolloGiftHistoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(ApolloGiftHistoryComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: matTabSelectionChange', () => {
    const testIndex: number = 1;

    it('should displatch SetApolloGiftHistoryMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetApolloGiftHistoryMatTabIndex(testIndex),
      );
    });
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
    it('should displatch SetApolloGiftHistorySelectedPlayerIdentities with correct data', () => {
      component.onPlayerIdentitiesChange(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetApolloGiftHistorySelectedPlayerIdentities(event),
      );
    });
  });
});
