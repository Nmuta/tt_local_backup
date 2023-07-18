import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { WoodstockCreateBulkAuctionComponent } from './woodstock-create-bulk-auction.component';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WoodstockCreateBulkAuctionComponent', () => {
  let component: WoodstockCreateBulkAuctionComponent;
  let fixture: ComponentFixture<WoodstockCreateBulkAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockCreateBulkAuctionComponent, HumanizePipe],
      imports: [PipesModule, HttpClientTestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockCreateBulkAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
