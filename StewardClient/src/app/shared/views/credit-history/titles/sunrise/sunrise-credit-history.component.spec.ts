import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { SunriseCreditHistoryComponent } from './sunrise-credit-history.component';

describe('SunriseCreditHistoryComponent', () => {
  let component: SunriseCreditHistoryComponent;
  let fixture: ComponentFixture<SunriseCreditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseCreditHistoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseCreditHistoryComponent);
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
