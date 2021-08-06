import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UGCComponent } from './ugc.component';

describe('UGCComponent', () => {
  let component: UGCComponent;
  let fixture: ComponentFixture<UGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UGCComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
