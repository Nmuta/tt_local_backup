import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSteelheadService } from '@services/steelhead/steelhead.service.mock';

import { SteelheadBanHistoryComponent } from './steelhead-ban-history.component';

describe('SteelheadBanHistoryComponent', () => {
  let component: SteelheadBanHistoryComponent;
  let fixture: ComponentFixture<SteelheadBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadBanHistoryComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadBanHistoryComponent);
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
