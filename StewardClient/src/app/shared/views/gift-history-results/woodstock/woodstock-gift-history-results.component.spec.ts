import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { WoodstockService } from '@services/woodstock';
import { createMockWoodstockService } from '@services/woodstock/woodstock.service.mock';
import { WoodstockGiftHistoryResultsComponent } from './woodstock-gift-history-results.component';

describe('WoodstockGiftHistoryResultsComponent', () => {
  let component: WoodstockGiftHistoryResultsComponent;
  let fixture: ComponentFixture<WoodstockGiftHistoryResultsComponent>;
  let mockWoodstockService: WoodstockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockGiftHistoryResultsComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);

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

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );

  describe('Method: retrieveHistoryByPlayer', () => {
    beforeEach(() => {
      mockWoodstockService.getGiftHistoryByXuid$ = jasmine.createSpy('getGiftHistoryByXuid$');
    });

    it('shoudl call WoodstockService.getGiftHistoryByXuid$()', () => {
      component.retrieveHistoryByPlayer$();

      expect(mockWoodstockService.getGiftHistoryByXuid$).toHaveBeenCalled();
    });
  });

  describe('Method: retrieveHistoryByLspGroup', () => {
    beforeEach(() => {
      mockWoodstockService.getGiftHistoryByLspGroup$ = jasmine.createSpy(
        'getGiftHistoryByLspGroup$',
      );
    });

    it('shoudl call WoodstockService.getGiftHistoryByLspGroup$()', () => {
      component.retrieveHistoryByLspGroup$();

      expect(mockWoodstockService.getGiftHistoryByLspGroup$).toHaveBeenCalled();
    });
  });
});
