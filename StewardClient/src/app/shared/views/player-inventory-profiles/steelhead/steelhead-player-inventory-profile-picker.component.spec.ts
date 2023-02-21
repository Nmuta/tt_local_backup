import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { SteelheadPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/steelhead/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockSteelheadInventoryService } from '@services/api-v2/steelhead/inventory/steelhead-inventory.service.mock';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import {
  createMockSteelheadPlayerInventoryService,
  MockSteelheadPlayerInventoryService,
} from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service.mock';
import { createMockSteelheadService } from '@services/steelhead';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { SteelheadPlayerInventoryProfilePickerComponent } from './steelhead-player-inventory-profile-picker.component';

describe('SteelheadPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<SteelheadPlayerInventoryProfilePickerComponent>;
  let mockSteelheadPlayerInventoryService: SteelheadPlayerInventoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerInventoryProfilePickerComponent],
      providers: [
        createMockSteelheadService(),
        createMockSteelheadPlayerInventoryService(),
        createMockSteelheadInventoryService(),
      ],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockSteelheadPlayerInventoryService = TestBed.inject(
      SteelheadPlayerInventoryService,
    ) as unknown as SteelheadPlayerInventoryService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(SteelheadPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockSteelheadPlayerInventoryService(null).getInventoryProfilesByXuid$,
    fn => (mockSteelheadPlayerInventoryService.getInventoryProfilesByXuid$ = fn),
  );
});
