import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { StandardCopyComponent } from './standard-copy.component';

@Component({
  template: '<standard-copy>test</standard-copy>',
})
class TestHarnessComponent {}

describe('StandardCopyComponent', () => {
  let component: StandardCopyComponent;
  let fixture: ComponentFixture<StandardCopyComponent>;
  // let harnessComponent: TestHarnessComponent;
  let harness: ComponentFixture<TestHarnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHarnessComponent, StandardCopyComponent],
      imports: [MatTooltipModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardCopyComponent);
    component = fixture.componentInstance;
    harness = TestBed.createComponent(TestHarnessComponent);
    // harnessComponent = harness.componentInstance;
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
