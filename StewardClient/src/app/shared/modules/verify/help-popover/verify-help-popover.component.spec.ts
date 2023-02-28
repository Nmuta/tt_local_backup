import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VerifyHelpPopoverComponent } from './verify-help-popover.component';

describe('VerifyHelpPopoverComponent', () => {
  let component: VerifyHelpPopoverComponent;
  let fixture: ComponentFixture<VerifyHelpPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyHelpPopoverComponent],
      imports: [MatTooltipModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyHelpPopoverComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
