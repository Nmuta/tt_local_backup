import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloPlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/apollo/players/ban-summaries';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService, createMockApolloService } from '@services/apollo';
import faker from 'faker';
import { keys } from 'lodash';
import { of } from 'rxjs';
import { defer } from 'rxjs';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';

import { ApolloBanningComponent } from './apollo-banning.component';

describe('ApolloBanningComponent', () => {
  let component: ApolloBanningComponent;
  let fixture: ComponentFixture<ApolloBanningComponent>;
  let apollo: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloBanningComponent],
      providers: [createMockApolloService(), createMockBackgroundJobService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    apollo = TestBed.inject(ApolloService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloBanningComponent);
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
    apollo.getBanSummariesByXuids = jasmine
      .createSpy('getBanSummariesByXuids')
      .and.callFake((xuids: BigNumber[]) => {
        const summaries = ApolloPlayersBanSummariesFakeApi.make(xuids);
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

    expect(apollo.getBanSummariesByXuids).toHaveBeenCalledTimes(1);
    expect(keys(component.summaryLookup).length).toBe(testXuids.length);

    const lookup0 = component.summaryLookup[testXuids[0].toString()];
    expect(lookup0).toBeDefined();
    expect(component.bannedXuids.length).toBe(1);
  });
});
