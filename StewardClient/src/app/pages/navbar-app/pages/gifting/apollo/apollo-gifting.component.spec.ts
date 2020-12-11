import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { IdentityResultAlphaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { UpdateCurrentGiftingPageTitle } from '@shared/state/user/user.actions';
import { UserState } from '@shared/state/user/user.state';
import { ApolloGiftingComponent } from './apollo-gifting.component';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { SetApolloSelectedPlayerIdentities } from './state/apollo-gifting.state.actions';

describe('ApolloGiftingComponent', () => {
  let component: ApolloGiftingComponent;
  let fixture: ComponentFixture<ApolloGiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, ApolloGiftingState]),
        ],
        declarations: [ApolloGiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockMsalService()],
      }).compileComponents();

      fixture = TestBed.createComponent(ApolloGiftingComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should displatch UpdateCurrentGiftingPageTitle with correct data', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new UpdateCurrentGiftingPageTitle(component.title));
    })
  });

  describe('Method: selectedPlayerIndentities', () => {
    let event: IdentityResultAlphaBatch;
    beforeEach(() => {
      event = [{
        query: undefined,
        xuid: BigInt(123456789)
      }];
    });
    it('should displatch SetApolloSelectedPlayerIdentities with correct data', () => {
      component.selectedPlayerIndentities(event);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetApolloSelectedPlayerIdentities(event));
    })
  });
});
