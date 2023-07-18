import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { SteelheadGiftingComponent } from './steelhead-gifting.component';
import { SteelheadGiftingState } from './state/steelhead-gifting.state';
import { SetSteelheadGiftingMatTabIndex } from './state/steelhead-gifting.state.actions';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';

describe('SteelheadGiftingComponent', () => {
  let component: SteelheadGiftingComponent;
  let fixture: ComponentFixture<SteelheadGiftingComponent>;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, SteelheadGiftingState]),
      ],
      declarations: [SteelheadGiftingComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadGiftingComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('Method: matTabSelectionChange', () => {
    const testIndex: number = 1;

    it('should displatch SetSteelheadGiftingMatTabIndex with correct data', () => {
      component.matTabSelectionChange(testIndex);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        new SetSteelheadGiftingMatTabIndex(testIndex),
      );
    });
  });
});
