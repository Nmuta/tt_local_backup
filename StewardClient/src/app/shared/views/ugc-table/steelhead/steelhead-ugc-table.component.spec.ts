import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakePlayerUgcItem } from '@models/player-ugc-item';
import { SteelheadUgcTableComponent } from './steelhead-ugc-table.component';
import { UgcType } from '@models/ugc-filters';
import faker from '@faker-js/faker';
import { GameTitle } from '@models/enums';
import { createMockSteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service.mock';
import { SteelheadUgcLookupService } from '@services/api-v2/steelhead/ugc/lookup/steelhead-ugc-lookup.service';

describe('SteelheadUgcTableComponent', () => {
  let component: SteelheadUgcTableComponent;
  let fixture: ComponentFixture<SteelheadUgcTableComponent>;
  let mockSteelheadUgcLookupService: SteelheadUgcLookupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SteelheadUgcTableComponent, BigJsonPipe],
      providers: [createMockSteelheadUgcLookupService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadUgcTableComponent);
    component = fixture.componentInstance;
    mockSteelheadUgcLookupService = TestBed.inject(SteelheadUgcLookupService);

    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: ngOnInit', () => {
    describe('When table offsetWidth is greater than 1000', () => {
      beforeEach(() => {
        component.table = { nativeElement: { offsetWidth: 1500 } };
      });

      it('Should set useExpandoColumnDef to false', () => {
        component.ngOnInit();

        expect(component.useExpandoColumnDef).toBeFalsy();
      });
    });

    describe('When table offsetWidth is less than than 1000', () => {
      beforeEach(() => {
        component.table = { nativeElement: { offsetWidth: 500 } };
      });

      it('Should set useExpandoColumnDef to true', () => {
        component.ngOnInit();

        expect(component.useExpandoColumnDef).toBeTruthy();
      });
    });
  });

  describe('Method: ngAfterViewInit', () => {
    it('Should set ugcTableDataSource.paginator', () => {
      component.ngAfterViewInit();

      expect(component.ugcTableDataSource.paginator).toBeTruthy();
    });
  });

  describe('Method: ngOnChanges', () => {
    describe('When there are query changes', () => {
      const changes: SimpleChanges = {
        content: {
          previousValue: null,
          currentValue: fakePlayerUgcItem(),
          firstChange: false,
          isFirstChange: () => {
            return false;
          },
        },
      };

      beforeEach(() => {
        component.content = [fakePlayerUgcItem()];
        component.contentType = UgcType.Photo;
        component.gameTitle = GameTitle.FH5;
      });

      it('should request getLeaderboardScores$', () => {
        component.ngOnChanges(changes);

        expect(component.ugcTableDataSource.data).toEqual(component.content);
        expect(component.ugcCount).toEqual(component.content.length);
        expect(component.paginator.pageIndex).toEqual(0);
        expect(component.displayTableWideActions).toBeTruthy();
      });
    });
  });

  describe('Method: retrievePhotoThumbnails', () => {
    it('should call getUgcPhotoThumbnails$', () => {
      component.retrievePhotoThumbnails([]);

      expect(mockSteelheadUgcLookupService.getUgcPhotoThumbnails$).toHaveBeenCalled();
    });
  });

  describe('Method: getUgcItem', () => {
    const ugcId = faker.datatype.uuid();
    const ugcType = UgcType.Livery;

    it('should call SteelheadService.getPlayerUgcItem$', () => {
      component.getUgcItem(ugcId, ugcType);

      expect(mockSteelheadUgcLookupService.getPlayerUgcItem$).toHaveBeenCalledWith(ugcId, ugcType);
    });
  });
});
