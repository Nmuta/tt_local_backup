import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardFlagComponent } from './standard-flag.component';

describe('StandardFlagComponent', () => {
  let component: StandardFlagComponent;
  let fixture: ComponentFixture<StandardFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardFlagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
