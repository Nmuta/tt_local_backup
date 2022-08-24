import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { SunriseBanHistoryComponent } from './sunrise-ban-history.component';
import { createMockPermissionsService } from '@services/permissions';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('SunriseBanHistoryComponent', () => {
  let component: SunriseBanHistoryComponent;
  let fixture: ComponentFixture<SunriseBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseBanHistoryComponent],
      imports: [PipesModule],
      providers: [createMockSunriseService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseBanHistoryComponent);
    component = fixture.componentInstance;
    component.xuid = new BigNumber(8675309);
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should load history', () => {
    component.ngOnChanges();
    expect(component.isLoading).toBeFalsy();
  });
});
