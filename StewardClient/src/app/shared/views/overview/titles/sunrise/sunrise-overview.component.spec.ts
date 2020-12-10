import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { SunriseOverviewComponent } from './sunrise-overview.component';

describe('OverviewComponent', () => {
  let component: SunriseOverviewComponent;
  let fixture: ComponentFixture<SunriseOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseOverviewComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseOverviewComponent);
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
