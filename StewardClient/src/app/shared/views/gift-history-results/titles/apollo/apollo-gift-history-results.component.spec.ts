import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { ApolloGiftHistoryResultsComponent } from './apollo-gift-history-results.component';

describe('ApolloGiftHistoryComponent', () => {
  let component: ApolloGiftHistoryResultsComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryResultsComponent>;

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
    fixture.detectChanges();
  });

  it(
    'should create',
    waitForAsync(() => {
      expect(component).toBeTruthy();
    }),
  );
});
