import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunriseGiftHistoryComponent } from './sunrise-gift-history.component';

describe('SunriseGiftHistoryComponent', () => {
  let component: SunriseGiftHistoryComponent;
  let fixture: ComponentFixture<SunriseGiftHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunriseGiftHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGiftHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
