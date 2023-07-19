import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockOpusService, MockOpusService, OpusService } from '@services/opus';
import { Subject } from 'rxjs';

import { OpusPlayerInventoryComponent } from './opus-player-inventory.component';

describe('OpusPlayerInventoryComponent', () => {
  let component: OpusPlayerInventoryComponent;
  let fixture: ComponentFixture<OpusPlayerInventoryComponent>;
  let service: OpusService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusPlayerInventoryComponent],
      providers: [createMockOpusService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(OpusService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockOpusService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
