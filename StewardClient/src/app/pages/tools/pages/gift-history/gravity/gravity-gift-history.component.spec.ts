import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import { GravityGiftHistoryComponent } from './gravity-gift-history.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';
import { IdentityResultBetaBatch } from '@models/identity-query.model';
import faker from '@faker-js/faker';

describe('GravityGiftHistoryComponent', () => {
  let component: GravityGiftHistoryComponent;
  let fixture: ComponentFixture<GravityGiftHistoryComponent>;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, GravityGiftHistoryState]),
      ],
      declarations: [GravityGiftHistoryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(GravityGiftHistoryComponent);
    component = fixture.debugElement.componentInstance;

    mockStore = TestBed.inject(Store);
    mockStore.dispatch = jasmine.createSpy('dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When selectedPlayerIdentities$ outputs a selection', () => {
      const gamertag = faker.random.word();

      beforeEach(() => {
        Object.defineProperty(component, 'selectedPlayerIdentities$', { writable: true });
        component.selectedPlayerIdentities$ = of([
          {
            query: null,
            gamertag: gamertag,
          },
        ] as IdentityResultBetaBatch);
      });

      it('should set selected player', () => {
        component.ngOnInit();

        expect(component.selectedPlayer).not.toBeUndefined();
        expect(component.selectedPlayer).not.toBeNull();
        expect(component.selectedPlayer.gamertag).toEqual(gamertag);
      });
    });
  });
});
