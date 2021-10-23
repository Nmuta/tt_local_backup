import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionActionLogTableComponent } from './log-table.component';

describe('AuctionActionLogTableComponent', () => {
  let component: AuctionActionLogTableComponent;
  let fixture: ComponentFixture<AuctionActionLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionActionLogTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionActionLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
