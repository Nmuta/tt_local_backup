import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityGiftHistoryResultsComponent } from './gravity-gift-history-results.component';

describe('GravityGiftHistoryComponent', () => {
  let component: GravityGiftHistoryResultsComponent;
  let fixture: ComponentFixture<GravityGiftHistoryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GravityGiftHistoryResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftHistoryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
