import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardFormsComponent } from './standard-forms.component';

describe('StandardFormsComponent', () => {
  let component: StandardFormsComponent;
  let fixture: ComponentFixture<StandardFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardFormsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
