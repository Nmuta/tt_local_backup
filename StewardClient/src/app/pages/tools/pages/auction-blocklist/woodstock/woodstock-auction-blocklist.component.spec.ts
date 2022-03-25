import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockAuctionBlocklistComponent } from './woodstock-auction-blocklist.component';
import { WoodstockAuctionBlocklistService } from './woodstock-auction-blocklist.service';

describe('WoodstockAuctionBlocklistComponent', () => {
  let component: WoodstockAuctionBlocklistComponent;
  let fixture: ComponentFixture<WoodstockAuctionBlocklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockAuctionBlocklistComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WoodstockAuctionBlocklistService],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockAuctionBlocklistComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
