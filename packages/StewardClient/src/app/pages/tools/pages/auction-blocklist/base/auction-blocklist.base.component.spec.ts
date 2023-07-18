import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { SunriseAuctionBlocklistFakeApi } from '@interceptors/fake-api/apis/title/sunrise/auctionBlocklist';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import BigNumber from 'bignumber.js';
import { Observable, of, Subject } from 'rxjs';
import { AuctionBlocklistBaseComponent } from './auction-blocklist.base.component';
import { AuctionBlocklistService } from './auction-blocklist.base.service';

/** Test for auction blocklist service. */
class TestAuctionBlocklistService implements AuctionBlocklistService {
  /** Get game title. */
  public getGameTitle(): GameTitle {
    return null;
  }
  /** Get auction blocklist. */
  public getAuctionBlocklist$(): Observable<AuctionBlocklistEntry[]> {
    return null;
  }
  /** Post auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    _entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return null;
  }
  /** Delete auction blocklist entry. */
  public deleteAuctionBlocklistEntry$(_carId: BigNumber): Observable<AuctionBlocklistEntry[]> {
    return null;
  }
}

describe('AuctionBlocklistBaseComponent', () => {
  let component: AuctionBlocklistBaseComponent;
  let fixture: ComponentFixture<AuctionBlocklistBaseComponent>;
  let auctionBlocklistEntries: AuctionBlocklistEntry[];

  const mockService: TestAuctionBlocklistService = new TestAuctionBlocklistService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [AuctionBlocklistBaseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [TestAuctionBlocklistService],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionBlocklistBaseComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
    component.newEntries$ = new Subject<AuctionBlocklistEntry[]>();

    auctionBlocklistEntries = SunriseAuctionBlocklistFakeApi.make();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      mockService.getAuctionBlocklist$ = jasmine
        .createSpy('getAuctionBlocklist$')
        .and.returnValue(of(auctionBlocklistEntries));
      component.getMonitor.monitorSingleFire = jasmine.createSpy('monitorSingleFire');
    });

    it('Should call getAuctionBlocklist$', () => {
      fixture.detectChanges();

      expect(mockService.getAuctionBlocklist$).toHaveBeenCalled();
    });

    it('Should populate the rawBlocklist', () => {
      fixture.detectChanges();

      expect(component.rawBlocklist.length).toEqual(auctionBlocklistEntries.length);
      expect(component.rawBlocklist[0].carId).toEqual(auctionBlocklistEntries[0].carId);
      expect(component.rawBlocklist[1].doesExpire).toEqual(auctionBlocklistEntries[1].doesExpire);
      expect(component.rawBlocklist[2].expireDateUtc).toEqual(
        auctionBlocklistEntries[2].expireDateUtc,
      );
    });

    it('Should populate the form array', () => {
      fixture.detectChanges();

      expect(component.formArray.length).toEqual(auctionBlocklistEntries.length);
      expect((component.formArray.controls[0] as FormGroup).controls.carId.value).toEqual(
        auctionBlocklistEntries[0].carId,
      );
      expect((component.formArray.controls[1] as FormGroup).controls.doesExpire.value).toEqual(
        auctionBlocklistEntries[1].doesExpire,
      );
      expect((component.formArray.controls[2] as FormGroup).controls.expireDateUtc.value).toEqual(
        auctionBlocklistEntries[2].expireDateUtc.toISO(),
      );
    });

    it('Should populate the table blocklist', () => {
      fixture.detectChanges();

      expect(component.blocklist.data.length).toEqual(auctionBlocklistEntries.length);
      expect(component.allMonitors).toContain(component.blocklist.data[0].postMonitor);
    });
  });
});
