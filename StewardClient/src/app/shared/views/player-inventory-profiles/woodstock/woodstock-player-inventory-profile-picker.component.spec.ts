import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { WoodstockPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/woodstock/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import {
  createMockWoodstockService,
  MockWoodstockService,
  WoodstockService,
} from '@services/woodstock';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { WoodstockPlayerInventoryProfilePickerComponent } from './woodstock-player-inventory-profile-picker.component';

describe('WoodstockPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<WoodstockPlayerInventoryProfilePickerComponent>;
  let service: MockWoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerInventoryProfilePickerComponent],
      providers: [createMockWoodstockService()],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = (TestBed.inject(WoodstockService) as unknown) as MockWoodstockService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(WoodstockPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockWoodstockService(null).getPlayerInventoryProfilesByXuid$,
    fn => (service.getPlayerInventoryProfilesByXuid$ = fn),
  );
});
