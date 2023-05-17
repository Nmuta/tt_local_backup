import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
