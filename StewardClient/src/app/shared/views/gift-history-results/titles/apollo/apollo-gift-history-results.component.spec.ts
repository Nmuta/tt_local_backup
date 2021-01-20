import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloGiftHistoryResultsComponent } from './apollo-gift-history-results.component';

describe('ApolloGiftHistoryComponent', () => {
  let component: ApolloGiftHistoryResultsComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApolloGiftHistoryResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
