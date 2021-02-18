import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { OpusPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/opus/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockOpusService, MockOpusService, OpusService } from '@services/opus';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { OpusPlayerInventoryProfilePickerComponent } from './opus-player-inventory-profile-picker.component';

describe('OpusPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<OpusPlayerInventoryProfilePickerComponent>;
  let service: MockOpusService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpusPlayerInventoryProfilePickerComponent ],
      providers: [createMockOpusService()],
      imports: [MatChipsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    service = TestBed.inject(OpusService) as unknown as MockOpusService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(OpusPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockOpusService().getPlayerInventoryProfilesByXuid,
    fn => service.getPlayerInventoryProfilesByXuid = fn);
});
