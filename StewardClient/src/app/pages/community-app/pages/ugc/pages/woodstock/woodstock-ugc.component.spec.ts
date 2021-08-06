import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoodstockUGCComponent } from './woodstock-ugc.component';

describe('WoodstockUGCComponent', () => {
  let component: WoodstockUGCComponent;
  let fixture: ComponentFixture<WoodstockUGCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockUGCComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockUGCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
