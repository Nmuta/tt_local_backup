import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { ApolloGiftHistoryResultsCompactComponent } from './apollo-gift-history-results-compact.component';

describe('ApolloGiftHistoryResultsCompactComponent', () => {
  let component: ApolloGiftHistoryResultsCompactComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryResultsCompactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApolloGiftHistoryResultsCompactComponent],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloGiftHistoryResultsCompactComponent);
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
