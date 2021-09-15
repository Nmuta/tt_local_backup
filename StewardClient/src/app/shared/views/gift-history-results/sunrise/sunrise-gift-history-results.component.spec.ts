import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SunriseService } from '@services/sunrise';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { SunriseGiftHistoryResultsComponent } from './sunrise-gift-history-results.component';

describe('SunriseGiftHistoryResultsComponent', () => {
  let component: SunriseGiftHistoryResultsComponent;
  let fixture: ComponentFixture<SunriseGiftHistoryResultsComponent>;
  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseGiftHistoryResultsComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);

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
      mockSunriseService.getGiftHistoryByXuid$ = jasmine.createSpy('getGiftHistoryByXuid$');
    });

    it('shoudl call SunriseService.getGiftHistoryByXuid$()', () => {
      component.retrieveHistoryByPlayer$();

      expect(mockSunriseService.getGiftHistoryByXuid$).toHaveBeenCalled();
    });
  });

  describe('Method: retrieveHistoryByLspGroup', () => {
    beforeEach(() => {
      mockSunriseService.getGiftHistoryByLspGroup$ = jasmine.createSpy('getGiftHistoryByLspGroup$');
    });

    it('shoudl call SunriseService.getGiftHistoryByLspGroup$()', () => {
      component.retrieveHistoryByLspGroup$();

      expect(mockSunriseService.getGiftHistoryByLspGroup$).toHaveBeenCalled();
    });
  });
});
