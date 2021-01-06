import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunriseBanningComponent } from './sunrise-banning.component';

describe('SunriseBanningComponent', () => {
  let component: SunriseBanningComponent;
  let fixture: ComponentFixture<SunriseBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBanningComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
