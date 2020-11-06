import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  getTestBed,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { of } from 'rxjs';

import { UserFlagsComponent } from './user-flags.component';

describe('UserFlagsComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: UserFlagsComponent;
  let fixture: ComponentFixture<UserFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFlagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    })
  );
});
