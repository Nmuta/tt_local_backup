import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunriseGiftingComponent } from './sunrise-gifting.component';

describe('SunriseGiftingComponent', () => {
  let component: SunriseGiftingComponent;
  let fixture: ComponentFixture<SunriseGiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseGiftingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
