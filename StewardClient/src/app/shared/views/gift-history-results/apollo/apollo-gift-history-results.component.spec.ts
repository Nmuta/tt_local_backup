import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { ApolloService } from '@services/apollo';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { ApolloGiftHistoryResultsComponent } from './apollo-gift-history-results.component';

describe('ApolloGiftHistoryComponent', () => {
  let component: ApolloGiftHistoryResultsComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryResultsComponent>;
  let mockApolloService: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloGiftHistoryResultsComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);

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
      mockApolloService.getGiftHistoryByXuid$ = jasmine.createSpy('getGiftHistoryByXuid$');
    });

    it('shoudl call ApolloService.getGiftHistoryByXuid$()', () => {
      component.retrieveHistoryByPlayer$();

      expect(mockApolloService.getGiftHistoryByXuid$).toHaveBeenCalled();
    });
  });

  describe('Method: retrieveHistoryByLspGroup', () => {
    beforeEach(() => {
      mockApolloService.getGiftHistoryByLspGroup$ = jasmine.createSpy('getGiftHistoryByLspGroup$');
    });

    it('shoudl call ApolloService.getGiftHistoryByLspGroup$()', () => {
      component.retrieveHistoryByLspGroup$();

      expect(mockApolloService.getGiftHistoryByLspGroup$).toHaveBeenCalled();
    });
  });
});
