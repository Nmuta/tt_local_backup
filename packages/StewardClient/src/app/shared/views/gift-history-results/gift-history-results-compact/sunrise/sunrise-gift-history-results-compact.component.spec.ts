import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { SunriseGiftHistoryResultsCompactComponent } from './sunrise-gift-history-results-compact.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SunriseGiftHistoryResultsCompactComponent', () => {
  let component: SunriseGiftHistoryResultsCompactComponent;
  let fixture: ComponentFixture<SunriseGiftHistoryResultsCompactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SunriseGiftHistoryResultsCompactComponent],
        providers: [createMockSunriseService()],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGiftHistoryResultsCompactComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    component.selectedPlayer = {
      query: null,
      gamertag: faker.random.word(),
      xuid: fakeBigNumber(),
      error: null,
    } as IdentityResultAlpha;

    component.selectedGroup = {
      id: fakeBigNumber(),
      name: faker.random.word(),
    } as LspGroup;
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
