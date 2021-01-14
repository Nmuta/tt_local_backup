import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApolloGiftHistoryComponent } from './apollo-gift-history.component';

describe('ApolloGiftHistoryComponent', () => {
  let component: ApolloGiftHistoryComponent;
  let fixture: ComponentFixture<ApolloGiftHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApolloGiftHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApolloGiftHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
