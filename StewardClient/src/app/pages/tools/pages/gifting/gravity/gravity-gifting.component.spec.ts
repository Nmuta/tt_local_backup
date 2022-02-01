import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { faker } from '@interceptors/fake-api/utility';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
import { NgxsModule, Store } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';
import { GravityGiftingComponent } from './gravity-gifting.component';
import { GravityGiftingState } from './state/gravity-gifting.state';

describe('GravityGiftingComponent', () => {
  let component: GravityGiftingComponent;
  let fixture: ComponentFixture<GravityGiftingComponent>;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState, GravityGiftingState]),
        ],
        declarations: [GravityGiftingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...createMockMsalServices(), createMockLoggerService()],
      }).compileComponents();

      fixture = TestBed.createComponent(GravityGiftingComponent);
      component = fixture.debugElement.componentInstance;

      mockStore = TestBed.inject(Store);
      mockStore.dispatch = jasmine.createSpy('dispatch');
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When selectedPlayerIdentities$ outputs a selection', () => {
      const gamertag = faker.random.word();
      const identity: IdentityResultBeta = {
        query: null,
        gamertag: gamertag,
      };

      beforeEach(() => {
        Object.defineProperty(component, 'selectedPlayerIdentities$', { writable: true });
        component.selectedPlayerIdentities$ = of([identity] as IdentityResultBetaBatch);
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
