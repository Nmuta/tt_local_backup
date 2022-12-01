import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteelheadPlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/ban-summaries';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import faker from '@faker-js/faker';
import { keys } from 'lodash';
import { of } from 'rxjs';
import { defer } from 'rxjs';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { SteelheadBanningComponent } from './steelhead-banning.component';
import { SteelheadPlayersService } from '@services/api-v2/steelhead/players/steelhead-players.service';
import { createMockSteelheadPlayersService } from '@services/api-v2/steelhead/players/steelhead-players.service.mock';

describe('SteelheadBanningComponent', () => {
  let component: SteelheadBanningComponent;
  let fixture: ComponentFixture<SteelheadBanningComponent>;
  let steelhead: SteelheadPlayersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadBanningComponent],
      providers: [createMockSteelheadPlayersService(), createMockBackgroundJobService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    steelhead = TestBed.inject(SteelheadPlayersService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitBan();
  });

  it('should gather summaries', () => {
    const testXuids = [fakeXuid(), fakeXuid(), fakeXuid()];
    steelhead.getBanSummariesByXuids$ = jasmine
      .createSpy('getBanSummariesByXuids')
      .and.callFake((xuids: BigNumber[]) => {
        const summaries = SteelheadPlayersBanSummariesFakeApi.make(xuids);
        summaries.forEach(s => (s.banCount = new BigNumber(0)));
        summaries[0].banCount = new BigNumber(5);
        return defer(() => of(summaries));
      });

    const fakeIdentities = testXuids.map(
      xuid => <IdentityResultAlpha>{ gamertag: faker.name.firstName(), xuid: xuid },
    );
    component.playerIdentities = fakeIdentities;
    component.playerIdentities$.next(fakeIdentities);
    fixture.detectChanges();

    expect(steelhead.getBanSummariesByXuids$).toHaveBeenCalledTimes(1);
    expect(keys(component.summaryLookup).length).toBe(testXuids.length);

    const lookup0 = component.summaryLookup[testXuids[0].toString()];
    expect(lookup0).toBeDefined();
    expect(component.bannedXuids.length).toBe(1);
  });
});
