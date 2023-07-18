import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloUgcTableComponent } from './apollo-ugc-table.component';
import faker from '@faker-js/faker';
import { UgcType } from '@models/ugc-filters';
import { ApolloService } from '@services/apollo';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ApolloUgcTableComponent', () => {
  let component: ApolloUgcTableComponent;
  let fixture: ComponentFixture<ApolloUgcTableComponent>;
  let mockApolloService: ApolloService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatPaginatorModule, BrowserAnimationsModule, MatSnackBarModule],
      declarations: [ApolloUgcTableComponent, BigJsonPipe],
      providers: [createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ApolloUgcTableComponent);
    component = fixture.componentInstance;
    mockApolloService = TestBed.inject(ApolloService);

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
    it('should call ApolloService.getPlayerUgcItem$', () => {
      component.getUgcItem(faker.datatype.uuid(), UgcType.Livery);

      expect(mockApolloService.getPlayerUgcItem$).toHaveBeenCalled();
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
});
