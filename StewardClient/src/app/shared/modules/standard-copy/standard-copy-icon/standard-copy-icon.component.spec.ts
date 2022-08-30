import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StandardCopyIconComponent } from './standard-copy-icon.component';

@Component({
  template: '<standard-copy>test</standard-copy>',
})
class TestHarnessComponent {}

describe('StandardCopyIconComponent', () => {
  let component: StandardCopyIconComponent;
  let fixture: ComponentFixture<StandardCopyIconComponent>;
  let harness: ComponentFixture<TestHarnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHarnessComponent, StandardCopyIconComponent],
      imports: [MatTooltipModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardCopyIconComponent);
    component = fixture.componentInstance;
    harness = TestBed.createComponent(TestHarnessComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
