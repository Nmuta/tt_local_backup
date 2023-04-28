import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteelheadInventoryService } from '@services/api-v2/steelhead/inventory/steelhead-inventory.service';
import {
  createMockSteelheadInventoryService,
  MockSteelheadInventoryService,
} from '@services/api-v2/steelhead/inventory/steelhead-inventory.service.mock';
import { SteelheadPlayerInventoryService } from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service';
import {
  createMockSteelheadPlayerInventoryService,
  MockSteelheadPlayerInventoryService,
} from '@services/api-v2/steelhead/player/inventory/steelhead-player-inventory.service.mock';
import { Subject } from 'rxjs';

import { SteelheadPlayerInventoryComponent } from './steelhead-player-inventory.component';

describe('SteelheadPlayerInventoryComponent', () => {
  let component: SteelheadPlayerInventoryComponent;
  let fixture: ComponentFixture<SteelheadPlayerInventoryComponent>;
  let mockSteelheadPlayerInventoryService: SteelheadPlayerInventoryService;
  let mockSteelheadInventoryService: SteelheadInventoryService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadPlayerInventoryComponent],
      providers: [
        createMockSteelheadPlayerInventoryService(),
        createMockSteelheadInventoryService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockSteelheadPlayerInventoryService = TestBed.inject(SteelheadPlayerInventoryService);
    mockSteelheadInventoryService = TestBed.inject(SteelheadInventoryService);
    waitUntil$ = new Subject<void>();
    (
      mockSteelheadPlayerInventoryService as unknown as MockSteelheadPlayerInventoryService
    ).waitUntil$ = waitUntil$;
    (mockSteelheadInventoryService as unknown as MockSteelheadInventoryService).waitUntil$ =
      waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
