import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import {
  createMockSteelheadPlayerInventoryService,
  MockSteelheadPlayerInventoryService,
} from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service.mock';
import { Subject } from 'rxjs';

import { SteelheadPlayerInventoryComponent } from './steelhead-player-inventory.component';
import { NgxsModule } from '@ngxs/store';
import { MatDialogModule } from '@angular/material/dialog';
import { MasterInventoryItem } from '@models/master-inventory-item';
import BigNumber from 'bignumber.js';
import faker from '@faker-js/faker';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadMasterInventoryFakeApi } from '@interceptors/fake-api/apis/title/steelhead/masterInventory';

describe('SteelheadPlayerInventoryComponent', () => {
  let component: SteelheadPlayerInventoryComponent;
  let fixture: ComponentFixture<SteelheadPlayerInventoryComponent>;
  let mockSteelheadPlayerInventoryService: SteelheadPlayerInventoryService;
  let waitUntil$: Subject<void>;

  const fakeMasterInventory = SteelheadMasterInventoryFakeApi.make();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatDialogModule],
      declarations: [SteelheadPlayerInventoryComponent],
      providers: [createMockSteelheadPlayerInventoryService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockSteelheadPlayerInventoryService = TestBed.inject(SteelheadPlayerInventoryService);
    waitUntil$ = new Subject<void>();
    (
      mockSteelheadPlayerInventoryService as unknown as MockSteelheadPlayerInventoryService
    ).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    it('should define itemSelectionService', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.ngOnChanges({} as any);

      expect(component.itemSelectionService).not.toBeUndefined();
    });
  });

  describe('Method: addItemEvent', () => {
    let item: MasterInventoryItem;
    let profile: FullPlayerInventoryProfile;

    beforeEach(() => {
      item = fakeMasterInventory.creditRewards[0];

      profile = {
        profileId: new BigNumber(faker.datatype.number()),
        isCurrent: faker.datatype.boolean(),
      };

      component.profile = profile;
    });

    it('should keep profile set to the same information', () => {
      component.addItemEvent(item);

      expect(component.profile).toEqual(profile);
    });
  });
});
