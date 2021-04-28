import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationDataActivityComponent } from './obligation-data-activity.component';

describe('ObligationDataActivityComponent', () => {
  let component: ObligationDataActivityComponent;
  let fixture: ComponentFixture<ObligationDataActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObligationDataActivityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligationDataActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
