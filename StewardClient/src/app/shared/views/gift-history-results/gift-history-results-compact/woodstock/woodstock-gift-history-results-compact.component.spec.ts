import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockGiftHistoryResultsCompactComponent } from './woodstock-gift-history-results-compact.component';

describe('WoodstockGiftHistoryResultsCompactComponent', () => {
  let component: WoodstockGiftHistoryResultsCompactComponent;
  let fixture: ComponentFixture<WoodstockGiftHistoryResultsCompactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockGiftHistoryResultsCompactComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGiftHistoryResultsCompactComponent);
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
