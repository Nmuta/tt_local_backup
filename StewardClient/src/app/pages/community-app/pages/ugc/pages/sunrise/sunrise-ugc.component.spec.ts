import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunriseUGCComponent } from './sunrise-ugc.component';

describe('SunriseUGCComponent', () => {
  let component: SunriseUGCComponent;
  let fixture: ComponentFixture<SunriseUGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUGCComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
