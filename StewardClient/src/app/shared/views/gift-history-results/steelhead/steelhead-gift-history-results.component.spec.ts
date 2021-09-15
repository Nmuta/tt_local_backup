import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SteelheadService } from '@services/steelhead';
import { createMockSteelheadService } from '@services/steelhead/steelhead.service.mock';
import { SteelheadGiftHistoryResultsComponent } from './steelhead-gift-history-results.component';

describe('SteelheadGiftHistoryComponent', () => {
  let component: SteelheadGiftHistoryResultsComponent;
  let fixture: ComponentFixture<SteelheadGiftHistoryResultsComponent>;
  let mockSteelheadService: SteelheadService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadGiftHistoryResultsComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    mockSteelheadService = TestBed.inject(SteelheadService);

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
      mockSteelheadService.getGiftHistoryByXuid$ = jasmine.createSpy('getGiftHistoryByXuid$');
    });

    it('shoudl call SteelheadService.getGiftHistoryByXuid$()', () => {
      component.retrieveHistoryByPlayer$();

      expect(mockSteelheadService.getGiftHistoryByXuid$).toHaveBeenCalled();
    });
  });

  describe('Method: retrieveHistoryByLspGroup', () => {
    beforeEach(() => {
      mockSteelheadService.getGiftHistoryByLspGroup$ = jasmine.createSpy(
        'getGiftHistoryByLspGroup$',
      );
    });

    it('shoudl call SteelheadService.getGiftHistoryByLspGroup$()', () => {
      component.retrieveHistoryByLspGroup$();

      expect(mockSteelheadService.getGiftHistoryByLspGroup$).toHaveBeenCalled();
    });
  });
});
