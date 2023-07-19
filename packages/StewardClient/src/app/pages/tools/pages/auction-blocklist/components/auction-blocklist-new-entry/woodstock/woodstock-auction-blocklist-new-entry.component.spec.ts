import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockAuctionBlocklistNewEntryComponent } from './woodstock-auction-blocklist-new-entry.component';
import { WoodstockAuctionBlocklistNewEntryService } from './woodstock-auction-blocklist-new-entry.service';

describe('WoodstockAuctionBlocklistNewEntryComponent', () => {
  let component: WoodstockAuctionBlocklistNewEntryComponent;
  let fixture: ComponentFixture<WoodstockAuctionBlocklistNewEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockAuctionBlocklistNewEntryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WoodstockAuctionBlocklistNewEntryService],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockAuctionBlocklistNewEntryComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
