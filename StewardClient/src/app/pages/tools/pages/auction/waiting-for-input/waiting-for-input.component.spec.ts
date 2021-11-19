import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForInputComponent } from './waiting-for-input.component';

describe('WaitingForInputComponent', () => {
  let component: WaitingForInputComponent;
  let fixture: ComponentFixture<WaitingForInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitingForInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
