import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SunriseUgcTableComponent } from './sunrise-ugc-table.component';
import { SunriseService } from '@services/sunrise';
import { UgcType } from '@models/ugc-filters';
import faker from '@faker-js/faker';
import { createMockSunriseUgcHideService } from '@services/api-v2/sunrise/ugc/sunrise-ugc-hide.service.mock';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';

describe('SunriseUgcTableComponent', () => {
  let component: SunriseUgcTableComponent;
  let fixture: ComponentFixture<SunriseUgcTableComponent>;
  let mockSunriseService: SunriseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SunriseUgcTableComponent, BigJsonPipe],
      providers: [
        createMockSunriseService(),
        createMockSunriseUgcHideService(),
        createMockBackgroundJobService(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseUgcTableComponent);
    component = fixture.componentInstance;
    mockSunriseService = TestBed.inject(SunriseService);

    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: retrievePhotoThumbnails', () => {
    it('should call throw', () => {
      component.retrievePhotoThumbnails([]);

      expect(component).toThrowError;
    });
  });

  describe('Method: getUgcItem', () => {
    it('should call SunriseService.getPlayerUgcItem$', () => {
      component.getUgcItem(faker.datatype.uuid(), UgcType.Livery);

      expect(mockSunriseService.getPlayerUgcItem$).toHaveBeenCalled();
    });
  });

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
  });

  describe('Method: ngAfterViewInit', () => {
    it('Should set ugcTableDataSource.paginator', () => {
      component.ngAfterViewInit();

      expect(component.ugcTableDataSource.paginator).toBeTruthy();
    });
  });
});
