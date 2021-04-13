import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import * as faker from 'faker';
import { Subject } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { ApolloConsolesComponent } from './apollo-consoles.component';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { ApolloService, createMockApolloService } from '@services/apollo';

describe('ApolloConsolesComponent', () => {
  let component: ApolloConsolesComponent;
  let fixture: ComponentFixture<ApolloConsolesComponent>;

  let mockApolloService: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloConsolesComponent, BigJsonPipe],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloConsolesComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('valid initialization', () => {
    let consoleDetails$: Subject<ApolloConsoleDetailsEntry[]> = undefined;
    let consoleDetailsValue: ApolloConsoleDetailsEntry[] = undefined;

    beforeEach(
      waitForAsync(() => {
        // console details prep
        consoleDetails$ = new Subject<ApolloConsoleDetailsEntry[]>();
        consoleDetailsValue = SunrisePlayerXuidConsolesFakeApi.makeMany() as ApolloConsoleDetailsEntry[];
        mockApolloService.getConsoleDetailsByXuid = jasmine
          .createSpy('getConsoleDetailsByXuid')
          .and.returnValue(consoleDetails$);

        // emulate initialization event
        component.ngOnChanges();
      }),
    );

    describe('ngOnChanges', () => {
      it(
        'should skip undefined xuids',
        waitForAsync(() => {
          expect(component.isLoading).toBe(true);
          expect(component.loadError).toBeFalsy();
        }),
      );

      it(
        'should update when xuid set',
        waitForAsync(async () => {
          // emulate xuid update event
          component.identity = {
            query: undefined,
            gamertag: faker.name.firstName(),
            xuid: new BigNumber(faker.random.number({ min: 10_000, max: 500_000 })),
          };
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // value received
          consoleDetails$.next(consoleDetailsValue);
          consoleDetails$.complete();
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeFalsy();
        }),
      );

      it(
        'should update when request errored',
        waitForAsync(async () => {
          // emulate xuid update event
          component.identity = {
            query: undefined,
            gamertag: faker.name.firstName(),
            xuid: new BigNumber(faker.random.number({ min: 10_000, max: 500_000 })),
          };
          component.ngOnChanges();

          // waiting on value
          fixture.detectChanges();
          expect(component.isLoading).toBe(true);

          // error received
          consoleDetails$.error(new HttpErrorResponse({ error: 'hello' }));
          await fixture.whenStable();
          fixture.detectChanges();
          expect(component.isLoading).toBe(false);
          expect(component.loadError).toBeTruthy();
        }),
      );
    });
  });
});
