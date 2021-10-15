import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationPrincipalsComponent } from './obligation-principals.component';

describe('ObligationPrincipalsComponent', () => {
  let component: ObligationPrincipalsComponent;
  let fixture: ComponentFixture<ObligationPrincipalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObligationPrincipalsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObligationPrincipalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
