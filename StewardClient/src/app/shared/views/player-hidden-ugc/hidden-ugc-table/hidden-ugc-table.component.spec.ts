import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { HideableUgc, HideableUgcFileType } from '@models/hideable-ugc.model';
import { createMockOldPermissionsService, OldPermissionsService } from '@services/old-permissions';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

import { HiddenUgcServiceContract, HiddenUgcTableComponent } from './hidden-ugc-table.component';

/** Test Hidden Ugc Service */
class TestHiddenUgcService implements HiddenUgcServiceContract {
  title: GameTitle.FH5;
  /** Unhide UGC. */
  public unhideUgc$(
    _xuid: BigNumber,
    _fileType: HideableUgcFileType,
    _ugcId: GuidLikeString,
  ): Observable<void> {
    return;
  }
  /** Get player hidden ugc by xuid. */
  getPlayerHiddenUgcByXuid$(_xuid: BigNumber): Observable<HideableUgc[]> {
    return;
  }
}

describe('HiddenUgcTableComponent', () => {
  let component: HiddenUgcTableComponent;
  let fixture: ComponentFixture<HiddenUgcTableComponent>;
  let mockPermissionsService: OldPermissionsService;

  const mockService: TestHiddenUgcService = new TestHiddenUgcService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiddenUgcTableComponent],
      providers: [createMockOldPermissionsService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenUgcTableComponent);
    component = fixture.componentInstance;
    mockPermissionsService = TestBed.inject(OldPermissionsService);

    mockPermissionsService.currentUserHasWritePermission = jasmine
      .createSpy('currentUserHasWritePermission ')
      .and.returnValue(true);
    component.service = mockService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When service is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          fixture.detectChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual('No service defined for Hidden UGC Table component.');
        }
      });
    });

    describe('When service is provided', () => {
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
