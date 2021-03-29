import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOpsHomeComponent } from './home.component';

describe('LiveOpsHomeComponent', () => {
  let component: LiveOpsHomeComponent;
  let fixture: ComponentFixture<LiveOpsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveOpsHomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOpsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
