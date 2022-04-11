import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuidLikeString } from '@models/extended-types';
import { HideableUgc, HideableUgcFileType } from '@models/hideable-ugc.model';
import { createMockPermissionsService, PermissionsService } from '@services/permissions';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

import { HiddenUgcServiceContract, HiddenUgcTableComponent } from './hidden-ugc-table.component';

class TestHiddenUgcService implements HiddenUgcServiceContract {
  public unhideUgc$(
    _xuid: BigNumber,
    _fileType: HideableUgcFileType,
    _ugcId: GuidLikeString,
  ): Observable<void> {
    return;
  }
  getPlayerHiddenUgcByXuid$(_xuid: BigNumber): Observable<HideableUgc[]> {
    return;
  }
}

describe('HiddenUgcTableComponent', () => {
  let component: HiddenUgcTableComponent;
  let fixture: ComponentFixture<HiddenUgcTableComponent>;
  let mockPermissionsService: PermissionsService;

  const mockService: TestHiddenUgcService = new TestHiddenUgcService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiddenUgcTableComponent],
      providers: [createMockPermissionsService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenUgcTableComponent);
    component = fixture.componentInstance;
    mockPermissionsService = TestBed.inject(PermissionsService);

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
