import BigNumber from 'bignumber.js';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidConsolesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/consoleDetails';
import faker from '@faker-js/faker';
import { Subject } from 'rxjs';

import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { ApolloConsolesComponent } from './apollo-consoles.component';
import { ApolloConsoleDetailsEntry } from '@models/apollo';
import { ApolloService, createMockApolloService } from '@services/apollo';
import { createMockPermissionsService, OldPermissionsService } from '@services/old-permissions';

describe('ApolloConsolesComponent', () => {
  let component: ApolloConsolesComponent;
  let fixture: ComponentFixture<ApolloConsolesComponent>;

  let mockApolloService: ApolloService;
  let mockPermissionsService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloConsolesComponent, BigJsonPipe],
      providers: [createMockApolloService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloConsolesComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);
    mockPermissionsService = TestBed.inject(OldPermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let consoleDetails$: Subject<ApolloConsoleDetailsEntry[]> = undefined;
    let consoleDetailsValue: ApolloConsoleDetailsEntry[] = undefined;

    beforeEach(waitForAsync(() => {
      // console details prep
      consoleDetails$ = new Subject<ApolloConsoleDetailsEntry[]>();
      consoleDetailsValue =
        SunrisePlayerXuidConsolesFakeApi.makeMany() as ApolloConsoleDetailsEntry[];
      mockApolloService.getConsoleDetailsByXuid$ = jasmine
        .createSpy('getConsoleDetailsByXuid$')
        .and.returnValue(consoleDetails$);

      // emulate initialization event
      component.ngOnChanges();
    }));

    describe('ngOnChanges', () => {
      it('should skip undefined xuids', waitForAsync(() => {
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).toBeUndefined();
      }));

      it('should update when xuid set', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(true);

        // value received
        consoleDetails$.next(consoleDetailsValue);
        consoleDetails$.complete();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).toBeNull();
      }));

      it('should update when request errored', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = {
          query: undefined,
          gamertag: faker.name.firstName(),
          xuid: new BigNumber(faker.datatype.number({ min: 10_000, max: 500_000 })),
        };
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(true);

        // error received
        consoleDetails$.error(new HttpErrorResponse({ error: 'hello' }));
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.getConsoles?.isActive).toBe(false);
        expect(component.getConsoles?.status?.error).not.toBeNull();
      }));
    });
  });
});
