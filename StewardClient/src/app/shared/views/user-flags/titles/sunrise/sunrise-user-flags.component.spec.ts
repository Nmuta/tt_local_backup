import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { SunriseUserFlagsComponent } from './sunrise-user-flags.component';

describe('UserFlagsComponent', () => {
  let component: SunriseUserFlagsComponent;
  let fixture: ComponentFixture<SunriseUserFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUserFlagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUserFlagsComponent);
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
