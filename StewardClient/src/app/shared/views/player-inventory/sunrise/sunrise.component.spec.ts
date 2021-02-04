import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise';

import { SunrisePlayerInventoryComponent } from './sunrise.component';

describe('SunriseComponent', () => {
  let component: SunrisePlayerInventoryComponent;
  let fixture: ComponentFixture<SunrisePlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunrisePlayerInventoryComponent ],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
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
