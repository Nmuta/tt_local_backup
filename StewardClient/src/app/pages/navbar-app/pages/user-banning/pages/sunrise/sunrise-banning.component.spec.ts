import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise';

import { SunriseBanningComponent } from './sunrise-banning.component';

describe('SunriseBanningComponent', () => {
  let component: SunriseBanningComponent;
  let fixture: ComponentFixture<SunriseBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBanningComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitInternal();
  });
});
