import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  createMockWoodstockService,
  MockWoodstockService,
  WoodstockService,
} from '@services/woodstock';
import { Subject } from 'rxjs';

import { WoodstockPlayerInventoryComponent } from './woodstock-player-inventory.component';

describe('WoodstockPlayerInventoryComponent', () => {
  let component: WoodstockPlayerInventoryComponent;
  let fixture: ComponentFixture<WoodstockPlayerInventoryComponent>;
  let service: WoodstockService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockPlayerInventoryComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(WoodstockService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockWoodstockService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
