import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SteelheadBanHistoryComponent } from './steelhead-ban-history.component';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { createMockSteelheadBanHistoryService } from '@services/api-v2/steelhead/player/ban-history/steelhead-ban-history.service.mock';
import { createMockSteelheadBanService } from '@services/api-v2/steelhead/ban/steelhead-ban.service.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { createMockMultipleBanHistoryService } from '@services/api-v2/all/player/ban-history.service.mock';

describe('SteelheadBanHistoryComponent', () => {
  let component: SteelheadBanHistoryComponent;
  let fixture: ComponentFixture<SteelheadBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadBanHistoryComponent],
      imports: [PipesModule],
      providers: [
        createMockSteelheadBanHistoryService(),
        createMockSteelheadBanService(),
        createMockOldPermissionsService(),
        createMockMultipleBanHistoryService(),
      ],
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
  });
});
