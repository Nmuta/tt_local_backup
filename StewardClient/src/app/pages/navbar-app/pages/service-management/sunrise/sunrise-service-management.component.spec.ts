import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { SunriseAuctionBlocklistFakeApi } from '@interceptors/fake-api/apis/title/sunrise/auctionBlocklist';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { NgxsModule } from '@ngxs/store';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { of } from 'rxjs';
import { SunriseServiceManagementComponent } from './sunrise-service-management.component';

describe('SunriseServiceManagementComponent', () => {
  let component: SunriseServiceManagementComponent;
  let fixture: ComponentFixture<SunriseServiceManagementComponent>;
  let sunriseService: SunriseService;
  let sunriseAuctionBlocklistEntries: AuctionBlocklistEntry[];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [SunriseServiceManagementComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockSunriseService()],
      }).compileComponents();

      fixture = TestBed.createComponent(SunriseServiceManagementComponent);
      component = fixture.debugElement.componentInstance;

      sunriseService = TestBed.inject(SunriseService);
      sunriseAuctionBlocklistEntries = SunriseAuctionBlocklistFakeApi.make();
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      sunriseService.getAuctionBlocklist$ = jasmine
        .createSpy('getAuctionBlocklist$')
        .and.returnValue(of(sunriseAuctionBlocklistEntries));
      component.getMonitor.monitorSingleFire = jasmine.createSpy('monitorSingleFire');
    });

    it('Should call getAuctionBlocklist$', () => {
      component.ngOnInit();

      expect(sunriseService.getAuctionBlocklist$).toHaveBeenCalled();
    });

    it('Should subscribe to value changes on input form', () => {
      component.ngOnInit();
    });

    it('Should populate the rawBlocklist', () => {
      component.ngOnInit();

      expect(component.rawBlocklist.length).toEqual(sunriseAuctionBlocklistEntries.length);
      expect(component.rawBlocklist[0].carId).toEqual(sunriseAuctionBlocklistEntries[0].carId);
      expect(component.rawBlocklist[1].doesExpire).toEqual(
        sunriseAuctionBlocklistEntries[1].doesExpire,
      );
      expect(component.rawBlocklist[2].expireDateUtc).toEqual(
        sunriseAuctionBlocklistEntries[2].expireDateUtc,
      );
    });

    it('Should populate the form array', () => {
      component.ngOnInit();

      expect(component.formArray.length).toEqual(sunriseAuctionBlocklistEntries.length);
      expect((component.formArray.controls[0] as FormGroup).controls.carId.value).toEqual(
        sunriseAuctionBlocklistEntries[0].carId,
      );
      expect((component.formArray.controls[1] as FormGroup).controls.doesExpire.value).toEqual(
        sunriseAuctionBlocklistEntries[1].doesExpire,
      );
      expect((component.formArray.controls[2] as FormGroup).controls.expireDateUtc.value).toEqual(
        sunriseAuctionBlocklistEntries[2].expireDateUtc.toISO(),
      );
    });

    it('Should populate the table blocklist', () => {
      component.ngOnInit();

      expect(component.blocklist.data.length).toEqual(sunriseAuctionBlocklistEntries.length);
      expect(component.allMonitors).toContain(component.blocklist.data[0].postMonitor);
    });
  });
});
