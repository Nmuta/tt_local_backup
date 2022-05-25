import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockBanHistoryComponent } from './woodstock-ban-history.component';
import { createMockPermissionsService } from '@services/permissions';

describe('WoodstockBanHistoryComponent', () => {
  let component: WoodstockBanHistoryComponent;
  let fixture: ComponentFixture<WoodstockBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockBanHistoryComponent],
      providers: [createMockWoodstockService(), createMockPermissionsService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockBanHistoryComponent);
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
