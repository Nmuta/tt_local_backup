import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockGiftHistoryResultsComponent } from './woodstock-gift-history-results.component';

describe('WoodstockGiftHistoryResultsComponent', () => {
  let component: WoodstockGiftHistoryResultsComponent;
  let fixture: ComponentFixture<WoodstockGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockGiftHistoryResultsComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGiftHistoryResultsComponent);
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
