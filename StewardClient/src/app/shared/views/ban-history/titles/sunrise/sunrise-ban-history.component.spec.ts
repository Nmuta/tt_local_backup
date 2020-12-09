import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { SunriseBanHistoryComponent } from './sunrise-ban-history.component';

describe('SunriseBanHistoryComponent', () => {
  let component: SunriseBanHistoryComponent;
  let fixture: ComponentFixture<SunriseBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBanHistoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanHistoryComponent);
    component = fixture.componentInstance;
    component.xuid = 8675309;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  it('should load history', () => {
    component.ngOnChanges();
    expect(component.isLoading).toBeFalsy();
  });
});
