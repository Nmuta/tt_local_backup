import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { WoodstockPlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/woodstock/player/xuid/profileSummary';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { WoodstockProfileSummary } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { WoodstockOverviewComponent } from './woodstock-overview.component';

describe('OverviewComponent', () => {
  let injector: TestBed;
  let component: WoodstockOverviewComponent;
  let fixture: ComponentFixture<WoodstockOverviewComponent>;
  let service: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [WoodstockOverviewComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(WoodstockService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let profileSummary$: Subject<WoodstockProfileSummary> = undefined;
    let profileSummaryValue: WoodstockProfileSummary = undefined;
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      // notifications list prep
      profileSummary$ = new Subject<WoodstockProfileSummary>();
      profileSummaryValue = WoodstockPlayerXuidProfileSummaryFakeApi.make();
      service.getProfileSummaryByXuid$ = jasmine
        .createSpy('getProfileSummaryByXuid$')
        .and.returnValue(profileSummary$);

      // emulate initialization event
      component.ngOnChanges();
    }));

    describe('ngOnChanges', () => {
      it('should skip undefined xuids', waitForAsync(() => {
        expect(component.isLoading).toBe(true);
        expect(component.loadError).toBeFalsy();
      }));

      it('should update when xuid set', waitForAsync(async () => {
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.isLoading).toBe(true);

        // value received
        profileSummary$.next(profileSummaryValue);
        profileSummary$.complete();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeFalsy();
      }));

      it('should update when request errored', waitForAsync(async () => {
        // emulate xuid update event
        component.identity = first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
        component.ngOnChanges();

        // waiting on value
        fixture.detectChanges();
        expect(component.isLoading).toBe(true);

        // error received
        profileSummary$.error(new HttpErrorResponse({ error: 'hello' }));
        await fixture.whenStable();
        fixture.detectChanges();
        expect(component.isLoading).toBe(false);
        expect(component.loadError).toBeTruthy();
      }));
    });
  });
});
