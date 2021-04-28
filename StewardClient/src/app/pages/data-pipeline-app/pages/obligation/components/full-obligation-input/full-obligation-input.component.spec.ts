import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullObligationInputComponent } from './full-obligation-input.component';

describe('FullObligationInputComponent', () => {
  let component: FullObligationInputComponent;
  let fixture: ComponentFixture<FullObligationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullObligationInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullObligationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
