import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@interceptors/fake-api/utility';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { UserRole } from '@models/enums';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { UserModel } from '@models/user.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import { ApolloGiftingComponent } from './apollo-gifting.component';
import { ApolloGiftingState } from './state/apollo-gifting.state';
import { SetApolloGiftingMatTabIndex } from './state/apollo-gifting.state.actions';

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
        providers: [...createMockMsalServices(), createMockLoggerService()],
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

  describe('Method: matTabSelectionChange', () => {
    const testIndex: number = 1;

    it('should displatch SetApolloGiftingMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(new SetApolloGiftingMatTabIndex(testIndex));
    });
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
        emailAddress: faker.internet.email(),
        role: UserRole.LiveOpsAdmin,
        name: faker.random.word(),
        objectId: faker.datatype.uuid(),
      } as UserModel);
    });

    describe('When selectedPlayerIdentities$ outputs a selection', () => {
      const gamertag = faker.random.word();
      const identity: IdentityResultAlpha = {
        query: null,
        gamertag: gamertag,
      };

      beforeEach(() => {
        Object.defineProperty(component, 'selectedPlayerIdentities$', { writable: true });
        component.selectedPlayerIdentities$ = of([identity] as IdentityResultAlphaBatch);
      });

      it('should set selected player', () => {
        component.ngOnInit();

        expect(component.selectedPlayerIdentities).not.toBeUndefined();
        expect(component.selectedPlayerIdentities.length).toEqual(1);
        expect(component.selectedPlayerIdentities[0].gamertag).toEqual(gamertag);
      });
    });
  });
});
