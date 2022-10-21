import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakePlayerUgcItem } from '@models/player-ugc-item';
import { WoodstockUgcTableComponent } from './woodstock-ugc-table.component';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { WoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-lookup.service';
import { createMockWoodstockUgcLookupService } from '@services/api-v2/woodstock/ugc/woodstock-ugc-lookup.service.mock';
import { UgcType } from '@models/ugc-filters';
import faker from '@faker-js/faker';
import { GameTitle } from '@models/enums';

describe('WoodstockUgcTableComponent', () => {
  let component: WoodstockUgcTableComponent;
  let fixture: ComponentFixture<WoodstockUgcTableComponent>;
  let mockWoodstockService: WoodstockService;
  let mockWoodstockUgcLookupService: WoodstockUgcLookupService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, BrowserAnimationsModule],
      declarations: [WoodstockUgcTableComponent, BigJsonPipe],
      providers: [createMockWoodstockService(), createMockWoodstockUgcLookupService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockUgcTableComponent);
    component = fixture.componentInstance;
    mockWoodstockService = TestBed.inject(WoodstockService);
    mockWoodstockUgcLookupService = TestBed.inject(WoodstockUgcLookupService);

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
    it('should call GetPhotoThumbnails$', () => {
      component.retrievePhotoThumbnails([]);

      expect(mockWoodstockUgcLookupService.GetPhotoThumbnails$).toHaveBeenCalled();
    });
  });

  describe('Method: getUgcItem', () => {
    it('should call WoodstockService.getPlayerUgcItem$', () => {
      component.getUgcItem(faker.datatype.uuid(), UgcType.Livery);

      expect(mockWoodstockService.getPlayerUgcItem$).toHaveBeenCalled();
    });
  });
});
