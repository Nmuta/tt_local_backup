import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuctionBlocklistNewEntryComponent } from './auction-blocklist-new-entry.component';
import { AuctionBlocklistNewEntryService } from './auction-blocklist-new-entry.service';

/** Test for auction blocklist new entry service. */
class TestAuctionBlocklistNewEntryService implements AuctionBlocklistNewEntryService {
  /** Get game title. */
  public getGameTitle(): GameTitle {
    return null;
  }
  /** Post auction blocklist entries. */
  public postAuctionBlocklistEntries$(
    _entries: AuctionBlocklistEntry[],
  ): Observable<AuctionBlocklistEntry[]> {
    return null;
  }
}

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'AuctionBlocklistNewEntryComponent', () => {
  let component: AuctionBlocklistNewEntryComponent;
  let fixture: ComponentFixture<AuctionBlocklistNewEntryComponent>;

  const mockService: TestAuctionBlocklistNewEntryService =
    new TestAuctionBlocklistNewEntryService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [AuctionBlocklistNewEntryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [TestAuctionBlocklistNewEntryService],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(AuctionBlocklistNewEntryComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When formControls.doesExpire.valueChanges emits true', () => {
      it('should enable formControls.expireDateUtc', () => {
        component.formControls.doesExpire.setValue(true);

        expect(component.formControls.expireDateUtc.enabled).toBeTruthy();
      });
    });

    describe('When formControls.doesExpire.valueChanges emits false', () => {
      it('should disable formControls.expireDateUtc', () => {
        component.formControls.doesExpire.setValue(false);

        expect(component.formControls.expireDateUtc.enabled).toBeFalsy();
      });
    });
  });
});
