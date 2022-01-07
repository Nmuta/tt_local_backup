import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import {
  SteelheadService,
  createMockSteelheadService,
  MockSteelheadService,
} from '@services/steelhead';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { SteelheadPlayerInventoryProfilePickerComponent } from './steelhead-player-inventory-profile-picker.component';

describe('SteelheadPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<SteelheadPlayerInventoryProfilePickerComponent>;
  let service: MockSteelheadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerInventoryProfilePickerComponent],
      providers: [createMockSteelheadService()],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(SteelheadService) as unknown as MockSteelheadService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockSteelheadService().getPlayerInventoryProfilesByXuid$,
    fn => (service.getPlayerInventoryProfilesByXuid$ = fn),
  );
});
