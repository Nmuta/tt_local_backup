import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusBanningComponent } from './opus-banning.component';

describe('OpusBanningComponent', () => {
  let component: OpusBanningComponent;
  let fixture: ComponentFixture<OpusBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusBanningComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
