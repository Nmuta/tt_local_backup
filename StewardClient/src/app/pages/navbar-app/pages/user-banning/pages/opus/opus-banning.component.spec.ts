import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusBanningComponent } from './opus-banning.component';

describe('OpusBanningComponent', () => {
  let component: OpusBanningComponent;
  let fixture: ComponentFixture<OpusBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpusBanningComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submit();
  });
});
