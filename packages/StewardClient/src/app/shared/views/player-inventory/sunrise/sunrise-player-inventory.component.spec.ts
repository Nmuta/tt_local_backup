import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSunriseService, MockSunriseService, SunriseService } from '@services/sunrise';
import { Subject } from 'rxjs';

import { SunrisePlayerInventoryComponent } from './sunrise-player-inventory.component';

describe('SunrisePlayerInventoryComponent', () => {
  let component: SunrisePlayerInventoryComponent;
  let fixture: ComponentFixture<SunrisePlayerInventoryComponent>;
  let service: SunriseService;
  let waitUntil$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunrisePlayerInventoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(SunriseService);
    waitUntil$ = new Subject<void>();
    (service as unknown as MockSunriseService).waitUntil$ = waitUntil$;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
