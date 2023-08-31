import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApolloPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/identities';
import { OpusPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/opus/players/identities';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { ApolloService } from '@services/apollo';
import { MultiEnvironmentService } from '@services/multi-environment/multi-environment.service';
import { OpusService } from '@services/opus';
import { SteelheadService } from '@services/steelhead';
import { SunriseService } from '@services/sunrise';
import { WoodstockService } from '@services/woodstock';
import { first } from 'lodash';
import { of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AugmentedCompositeIdentity } from '../player-selection-base.component';

import { PlayerSelectionSingleComponent } from './player-selection-single.component';
import { MatChipInputEvent } from '@angular/material/chips';

describe('PlayerSelectionSingleComponent', () => {
  let component: PlayerSelectionSingleComponent;
  let fixture: ComponentFixture<PlayerSelectionSingleComponent>;
  let sunrise: SunriseService;
  let opus: OpusService;
  let apollo: ApolloService;
  let steelhead: SteelheadService;
  let woodstock: WoodstockService;

  const deferUntil$ = new Subject<void>();

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [PlayerSelectionSingleComponent],
        imports: [MatButtonToggleModule],
        providers: [MultiEnvironmentService],
      }),
    ).compileComponents();

    sunrise = TestBed.inject(SunriseService);
    opus = TestBed.inject(OpusService);
    apollo = TestBed.inject(ApolloService);
    steelhead = TestBed.inject(SteelheadService);
    woodstock = TestBed.inject(WoodstockService);

    sunrise.getPlayerIdentities$ = jasmine
      .createSpy('sunrise.getPlayerIdentities$')
      .and.callFake(q =>
        deferUntil$.pipe(switchMap(_ => of(SunrisePlayersIdentitiesFakeApi.make(q)))),
      );

    opus.getPlayerIdentities$ = jasmine
      .createSpy('opus.getPlayerIdentities$')
      .and.callFake(q =>
        deferUntil$.pipe(switchMap(_ => of(OpusPlayersIdentitiesFakeApi.make(q)))),
      );

    apollo.getPlayerIdentities$ = jasmine
      .createSpy('apollo.getPlayerIdentities$')
      .and.callFake(q =>
        deferUntil$.pipe(switchMap(_ => of(ApolloPlayersIdentitiesFakeApi.make(q)))),
      );

    steelhead.getPlayerIdentities$ = jasmine
      .createSpy('steelhead.getPlayerIdentities$')
      .and.callFake(q =>
        deferUntil$.pipe(switchMap(_ => of(SteelheadPlayersIdentitiesFakeApi.make(q)))),
      );

    woodstock.getPlayerIdentities$ = jasmine
      .createSpy('woodstock.getPlayerIdentities$')
      .and.callFake(q =>
        deferUntil$.pipe(switchMap(_ => of(WoodstockPlayersIdentitiesFakeApi.make(q)))),
      );
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PlayerSelectionSingleComponent);
    component = fixture.componentInstance;
    component.found.emit = jasmine.createSpy('emit').and.callThrough();
    fixture.detectChanges();
  }));

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should start in gamertag mode', () => {
    expect(component.lookupType).toBe('gamertag');
  });

  describe('when in gamertag mode', () => {
    describe('when empty data pasted', () => {
      let pasteTransferEvent: DataTransfer;
      let pasteEvent: ClipboardEvent;

      beforeEach(waitForAsync(() => {
        pasteTransferEvent = new DataTransfer();
        pasteTransferEvent.setData('text', '');
        pasteEvent = new ClipboardEvent('paste', { clipboardData: pasteTransferEvent });
        component.paste(pasteEvent);
      }));

      it('should do nothing', waitForAsync(() => {
        expect(pasteEvent.defaultPrevented).toBeFalsy();

        expect(opus.getPlayerIdentities$).toHaveBeenCalledTimes(0);
        expect(sunrise.getPlayerIdentities$).toHaveBeenCalledTimes(0);
        expect(apollo.getPlayerIdentities$).toHaveBeenCalledTimes(0);
        expect(steelhead.getPlayerIdentities$).toHaveBeenCalledTimes(0);
        expect(woodstock.getPlayerIdentities$).toHaveBeenCalledTimes(0);
      }));
    });

    describe('when data added', () => {
      const fakeGamertag = 'FakeGamertag';

      beforeEach(waitForAsync(() => {
        component.add({ input: null, value: fakeGamertag, chipInput: null } as MatChipInputEvent);
      }));

      it('should have value in lookupList', waitForAsync(() => {
        expect(component.lookupList).toContain(fakeGamertag);
      }));

      it('should call getPlayerIdentities$', waitForAsync(() => {
        expect(sunrise.getPlayerIdentities$).toHaveBeenCalledTimes(2);
        expect(opus.getPlayerIdentities$).toHaveBeenCalledTimes(1);
        expect(apollo.getPlayerIdentities$).toHaveBeenCalledTimes(2);
        // expect(steelhead.getPlayerIdentities$).toHaveBeenCalledTimes(1);
        // expect(woodstock.getPlayerIdentities$).toHaveBeenCalledTimes(1);
      }));

      describe('when data removed', () => {
        beforeEach(waitForAsync(() => {
          component.remove(first(component.foundIdentities));
        }));

        it('should emit lookupListChange', waitForAsync(() => {
          expect(component.lookupList.length).toBe(0);
        }));
      });
    });

    describe('when single-line data pasted', () => {
      let pasteEvent: ClipboardEvent;
      const fakeGamertag = 'FakeGamertag';

      beforeEach(waitForAsync(() => {
        pasteEvent = new ClipboardEvent('paste', { clipboardData: new DataTransfer() });
        pasteEvent.clipboardData.setData('text', fakeGamertag);
        pasteEvent.preventDefault = jasmine.createSpy('preventDefault').and.callThrough();
        component.paste(pasteEvent);
      }));

      it('should prevent default', waitForAsync(() => {
        expect(pasteEvent.preventDefault).toHaveBeenCalled();
      }));

      it('should call getPlayerIdentities$', waitForAsync(() => {
        expect(sunrise.getPlayerIdentities$).toHaveBeenCalledTimes(2);
        expect(opus.getPlayerIdentities$).toHaveBeenCalledTimes(1);
        expect(apollo.getPlayerIdentities$).toHaveBeenCalledTimes(2);
        // expect(steelhead.getPlayerIdentities$).toHaveBeenCalledTimes(1);
        // expect(steelhead.getPlayerIdentities$).toHaveBeenCalledTimes(1);
      }));

      it('should leave stub in foundIdentities', waitForAsync(() => {
        expect(component.foundIdentities.length).toBe(1);
        const stub = first(component.foundIdentities);
        expect(stub.query).toEqual({ gamertag: fakeGamertag });
        expect(stub.extra).toBeFalsy();
        expect(stub.sunrise).toBeFalsy();
        expect(stub.apollo).toBeFalsy();
        expect(stub.opus).toBeFalsy();
        expect(stub.steelhead).toBeFalsy();
        expect(stub.woodstock).toBeFalsy();
      }));

      it('should have value in lookupList', waitForAsync(() => {
        expect(component.lookupList).toContain(fakeGamertag);
      }));

      describe('when results come back', () => {
        let oldStub: AugmentedCompositeIdentity;

        beforeEach(waitForAsync(() => {
          oldStub = first(component.foundIdentities);
          deferUntil$.next();
        }));

        it('should populate the existing stub in foundIdentities', waitForAsync(() => {
          expect(component.foundIdentities.length).toBe(1);
          const newStub = first(component.foundIdentities);
          expect(newStub).toBe(oldStub);
          expect(newStub.query).toEqual({ gamertag: fakeGamertag });
          expect(newStub.extra).toBeTruthy('extra');
          expect(newStub.sunrise).toBeTruthy('sunrise');
          expect(newStub.apollo).toBeTruthy('apollo');
          expect(newStub.opus).toBeTruthy('opus');
          // expect(newStub.steelhead).toBeTruthy('steelhead');
          // expect(newStub.woodstock).toBeTruthy('woodstock');
        }));

        it('should emit found', waitForAsync(() => {
          expect(component.found.emit).toHaveBeenCalled();
        }));
      });
    });
  });
});
