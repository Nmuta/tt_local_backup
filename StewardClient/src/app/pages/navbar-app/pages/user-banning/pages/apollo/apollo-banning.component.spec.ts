import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo';

import { ApolloBanningComponent } from './apollo-banning.component';

describe('ApolloBanningComponent', () => {
  let component: ApolloBanningComponent;
  let fixture: ComponentFixture<ApolloBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloBanningComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    component.submitInternal();
  });
});
