import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanChipsComponent } from './ban-chips.component';

describe('BanChipsComponent', () => {
  let component: BanChipsComponent;
  let fixture: ComponentFixture<BanChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanChipsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
