import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseAuctionBlocklistNewEntryComponent } from './sunrise-auction-blocklist-new-entry.component';
import { SunriseAuctionBlocklistNewEntryService } from './sunrise-auction-blocklist-new-entry.service';

describe('SunriseAuctionBlocklistNewEntryComponent', () => {
  let component: SunriseAuctionBlocklistNewEntryComponent;
  let fixture: ComponentFixture<SunriseAuctionBlocklistNewEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SunriseAuctionBlocklistNewEntryComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SunriseAuctionBlocklistNewEntryService],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseAuctionBlocklistNewEntryComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
