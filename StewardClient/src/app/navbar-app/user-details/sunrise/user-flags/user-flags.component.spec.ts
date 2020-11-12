import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { UserFlagsComponent } from './user-flags.component';

describe('UserFlagsComponent', () => {
  let component: UserFlagsComponent;
  let fixture: ComponentFixture<UserFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFlagsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
