import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseAuctionBlocklistComponent } from './sunrise-auction-blocklist.component';
import { SunriseAuctionBlocklistService } from './sunrise-auction-blocklist.service';

describe('SunriseAuctionBlocklistComponent', () => {
  let component: SunriseAuctionBlocklistComponent;
  let fixture: ComponentFixture<SunriseAuctionBlocklistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SunriseAuctionBlocklistComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SunriseAuctionBlocklistService],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseAuctionBlocklistComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
