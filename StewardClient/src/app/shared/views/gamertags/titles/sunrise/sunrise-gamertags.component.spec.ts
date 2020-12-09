import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { SunriseGamertagsComponent } from './sunrise-gamertags.component';

describe('GamertagsComponent', () => {
  let component: SunriseGamertagsComponent;
  let fixture: ComponentFixture<SunriseGamertagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseGamertagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGamertagsComponent);
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
