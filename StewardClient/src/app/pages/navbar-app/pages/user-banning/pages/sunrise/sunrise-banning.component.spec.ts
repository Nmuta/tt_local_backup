import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SunrisePlayersBanSummariesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/ban-summaries';
import { faker, fakeXuid } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { keys } from 'lodash';
import { defer, of } from 'rxjs';

import { SunriseBanningComponent } from './sunrise-banning.component';

describe('SunriseBanningComponent', () => {
  let component: SunriseBanningComponent;
  let fixture: ComponentFixture<SunriseBanningComponent>;
  let sunrise: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBanningComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    sunrise = TestBed.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanningComponent);
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
    sunrise.getBanSummariesByXuids = jasmine
      .createSpy('getBanSummariesByXuids')
      .and.callFake((xuids: BigInt[]) => {
        const summaries = SunrisePlayersBanSummariesFakeApi.make(xuids);
        summaries.forEach(s => (s.banCount = BigInt(0)));
        summaries[0].banCount = BigInt(5);
        return defer(() => of(summaries));
      });

    const fakeIdentities = testXuids.map(
      xuid => <IdentityResultAlpha>{ gamertag: faker.name.firstName(), xuid: xuid },
    );
    component.formControls.playerIdentities.setValue(fakeIdentities, { emitEvent: true });
    fixture.detectChanges();

    expect(sunrise.getBanSummariesByXuids).toHaveBeenCalledTimes(1);
    expect(keys(component.summaryLookup).length).toBe(testXuids.length);

    const lookup0 = component.summaryLookup[testXuids[0].toString()];
    expect(lookup0).toBeDefined();
    expect(component.bannedXuids.length).toBe(1);
  });
});
