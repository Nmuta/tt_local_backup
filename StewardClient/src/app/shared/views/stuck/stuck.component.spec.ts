import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuckComponent } from './stuck.component';

describe('StuckComponent', () => {
  let component: StuckComponent;
  let fixture: ComponentFixture<StuckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StuckComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
