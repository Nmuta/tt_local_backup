import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { SunrisePlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/sunrise/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockSunriseService, MockSunriseService, SunriseService } from '@services/sunrise';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { SunrisePlayerInventoryProfilePickerComponent } from './sunrise-player-inventory-profile-picker.component';

describe('SunrisePlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<SunrisePlayerInventoryProfilePickerComponent>;
  let service: MockSunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunrisePlayerInventoryProfilePickerComponent],
      providers: [createMockSunriseService()],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = (TestBed.inject(SunriseService) as unknown) as MockSunriseService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(SunrisePlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockSunriseService(null).getPlayerInventoryProfilesByXuid$,
    fn => (service.getPlayerInventoryProfilesByXuid$ = fn),
  );
});
