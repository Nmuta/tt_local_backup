import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { SunrisePlayerXuidProfileSummaryFakeApi } from '@interceptors/fake-api/apis/title/sunrise/player/xuid/profileSummary';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { SunriseProfileSummary } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { first } from 'lodash';
import { Subject } from 'rxjs';

import { SunriseOverviewComponent } from './sunrise-overview.component';

describe('OverviewComponent', () => {
  let injector: TestBed;
  let component: SunriseOverviewComponent;
  let fixture: ComponentFixture<SunriseOverviewComponent>;
  let service: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipesModule],
      declarations: [SunriseOverviewComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('valid initialization', () => {
    let profileSummary$: Subject<SunriseProfileSummary> = undefined;
    let profileSummaryValue: SunriseProfileSummary = undefined;
    const testXuid = fakeXuid();

    beforeEach(waitForAsync(() => {
      // notifications list prep
      profileSummary$ = new Subject<SunriseProfileSummary>();
      profileSummaryValue = SunrisePlayerXuidProfileSummaryFakeApi.make();
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
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
        component.identity = first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: testXuid }]));
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
