import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockBanHistoryComponent } from './woodstock-ban-history.component';
import { createMockOldPermissionsService } from '@services/old-permissions';
import { PipesModule } from '@shared/pipes/pipes.module';
import { createMockMultipleBanHistoryService } from '@services/api-v2/all/player/ban-history.service.mock';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockBanHistoryComponent', () => {
  let component: WoodstockBanHistoryComponent;
  let fixture: ComponentFixture<WoodstockBanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [WoodstockBanHistoryComponent],
        imports: [PipesModule],
        providers: [
          createMockWoodstockService(),
          createMockOldPermissionsService(),
          createMockMultipleBanHistoryService(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
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
  });
});
