import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionMonitor } from '../action-monitor';

import { BigSpinnerComponent } from './big-spinner.component';

describe('BigSpinnerComponent', () => {
  let component: BigSpinnerComponent;
  let fixture: ComponentFixture<BigSpinnerComponent>;
  const mockMonitor: ActionMonitor = new ActionMonitor();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigSpinnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BigSpinnerComponent);
    component = fixture.componentInstance;
    component.monitor = mockMonitor;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
