import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunriseGiftHistoryResultsComponent } from './sunrise-gift-history-results.component';

describe('SunriseGiftHistoryComponent', () => {
  let component: SunriseGiftHistoryResultsComponent;
  let fixture: ComponentFixture<SunriseGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunriseGiftHistoryResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
