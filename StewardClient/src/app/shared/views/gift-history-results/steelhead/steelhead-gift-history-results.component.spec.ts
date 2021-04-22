import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSteelheadService } from '@services/steelhead/steelhead.service.mock';
import { SteelheadGiftHistoryResultsComponent } from './steelhead-gift-history-results.component';

describe('SteelheadGiftHistoryComponent', () => {
  let component: SteelheadGiftHistoryResultsComponent;
  let fixture: ComponentFixture<SteelheadGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadGiftHistoryResultsComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
