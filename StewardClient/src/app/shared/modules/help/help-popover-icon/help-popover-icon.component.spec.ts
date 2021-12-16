import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPopoverIconComponent } from './help-popover-icon.component';

describe('HelpPopoverIconComponent', () => {
  let component: HelpPopoverIconComponent;
  let fixture: ComponentFixture<HelpPopoverIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpPopoverIconComponent],
      imports: [OverlayModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPopoverIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
