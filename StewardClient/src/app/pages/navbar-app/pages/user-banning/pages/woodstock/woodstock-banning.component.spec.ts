import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WoodstockPlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/ban-summaries';
import { faker, fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { keys } from 'lodash';
import { defer, of } from 'rxjs';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';

import { WoodstockBanningComponent } from './woodstock-banning.component';

describe('WoodstockBanningComponent', () => {
  let component: WoodstockBanningComponent;
  let fixture: ComponentFixture<WoodstockBanningComponent>;
  let woodstock: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockBanningComponent],
      providers: [createMockWoodstockService(), createMockBackgroundJobService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    woodstock = TestBed.inject(WoodstockService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitInternal();
  });

  it('should gather summaries', () => {
    const testXuids = [fakeXuid(), fakeXuid(), fakeXuid()];
    woodstock.getBanSummariesByXuids = jasmine
      .createSpy('getBanSummariesByXuids')
      .and.callFake((xuids: BigNumber[]) => {
        const summaries = WoodstockPlayersBanSummariesFakeApi.make(xuids);
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

    expect(woodstock.getBanSummariesByXuids).toHaveBeenCalledTimes(1);
    expect(keys(component.summaryLookup).length).toBe(testXuids.length);

    const lookup0 = component.summaryLookup[testXuids[0].toString()];
    expect(lookup0).toBeDefined();
    expect(component.bannedXuids.length).toBe(1);
  });
});
