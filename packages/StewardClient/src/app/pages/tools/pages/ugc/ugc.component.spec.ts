import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgcComponent } from './ugc.component';

describe('UgcComponent', () => {
  let component: UgcComponent;
  let fixture: ComponentFixture<UgcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UgcComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UgcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
