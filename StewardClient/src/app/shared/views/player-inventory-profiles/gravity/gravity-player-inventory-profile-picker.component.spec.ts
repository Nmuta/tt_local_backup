import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { STANDARD_DATE_IMPORTS } from '@helpers/standard-imports';
import { GravityPlayersIdentitiesFakeApi } from '@interceptors/fake-api/apis/title/gravity/players/identities';
import { fakeXuid } from '@interceptors/fake-api/utility';
import { createMockGravityService, GravityService, MockGravityService } from '@services/gravity';
import { first } from 'lodash';
import { baseTests } from '../player-inventory-profiles-picker/player-inventory-profile-picker.base.component.spec';

import { GravityPlayerInventoryProfilePickerComponent } from './gravity-player-inventory-profile-picker.component';

describe('GravityPlayerInventoryProfilePickerComponent', () => {
  let fixture: ComponentFixture<GravityPlayerInventoryProfilePickerComponent>;
  let service: MockGravityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityPlayerInventoryProfilePickerComponent],
      providers: [createMockGravityService()],
      imports: [MatChipsModule, ...STANDARD_DATE_IMPORTS],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(GravityService) as unknown as MockGravityService;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityPlayerInventoryProfilePickerComponent);
    fixture.detectChanges();
  });

  baseTests(
    () => fixture,
    () => first(GravityPlayersIdentitiesFakeApi.make([{ xuid: fakeXuid() }])),
    () => new MockGravityService().getPlayerInventoryProfilesByT10Id$,
    fn => (service.getPlayerInventoryProfilesByT10Id$ = fn),
  );
});
