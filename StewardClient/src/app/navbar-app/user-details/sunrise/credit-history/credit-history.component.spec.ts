import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  getTestBed,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';

import { CreditHistoryComponent } from './credit-history.component';

describe('CreditHistoryComponent', () => {
  let injector: TestBed;
  let service: SunriseService;
  let component: CreditHistoryComponent;
  let fixture: ComponentFixture<CreditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditHistoryComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    injector = getTestBed();
    service = injector.inject(SunriseService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditHistoryComponent);
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
