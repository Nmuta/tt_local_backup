import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuckComponent } from './stuck.component';

describe('StuckComponent', () => {
  let component: StuckComponent;
  let fixture: ComponentFixture<StuckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StuckComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
