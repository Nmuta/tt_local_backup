import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakePlayerUgcItem } from '@models/player-ugc-item';
import { WoodstockUgcTableComponent } from './woodstock-ugc-table.component';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { EMPTY } from 'rxjs';
import { PlayerUgcItemTableEntries } from '../ugc-table.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { createMockPermissionsService, PermissionsService } from '@services/permissions';

describe('WoodstockUgcTableComponent', () => {
  let component: WoodstockUgcTableComponent;
  let fixture: ComponentFixture<WoodstockUgcTableComponent>;
  let mockWoodstockService: WoodstockService;
  let mockPermissionsService: PermissionsService;
  let mockMatDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [WoodstockUgcTableComponent, BigJsonPipe],
      providers: [
        createMockWoodstockService(),
        createMockPermissionsService(),
        {
          provide: MatDialog,
          useValue: { open: () => MatDialogRef },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockUgcTableComponent);
    component = fixture.componentInstance;
    mockMatDialog = TestBed.inject(MatDialog);
    mockWoodstockService = TestBed.inject(WoodstockService);
    mockPermissionsService = TestBed.inject(PermissionsService);

    fixture.detectChanges();

    mockMatDialog.open = jasmine.createSpy('open').and.returnValue({ afterClosed: () => EMPTY });
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: hideUgcItem', () => {
    const item: PlayerUgcItemTableEntries = fakePlayerUgcItem();
    item.monitor = new ActionMonitor();

    it('should call WoodstockService.hideUgc$()', () => {
      component.hideUgcItem(item);

      expect(mockWoodstockService.hideUgc$).toHaveBeenCalled();
    });
  });

  describe('Method: openFeatureUgcModal', () => {
    const item = fakePlayerUgcItem();

    it('should call MatDialog.open()', () => {
      component.openFeatureUgcModal(item);

      expect(mockMatDialog.open).toHaveBeenCalled();
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

      describe('When user has write permissions to feature UGC', () => {
        beforeEach(() => {
          mockPermissionsService.currentUserHasWritePermission = jasmine
            .createSpy('currentUserHasWritePermission')
            .and.returnValue(true);
        });

        it('should set canFeatureUgc to true', () => {
          component.ngOnInit();

          expect(component.canFeatureUgc).toBeTruthy();
        });
      });

      describe('When user does not have write permissions to feature UGC', () => {
        beforeEach(() => {
          mockPermissionsService.currentUserHasWritePermission = jasmine
            .createSpy('currentUserHasWritePermission')
            .and.returnValue(false);
        });

        it('should set canFeatureUgc to false', () => {
          component.ngOnInit();

          expect(component.canFeatureUgc).toBeFalsy();
        });
      });

      describe('When user has write permissions to hide UGC', () => {
        beforeEach(() => {
          mockPermissionsService.currentUserHasWritePermission = jasmine
            .createSpy('currentUserHasWritePermission')
            .and.returnValue(true);
        });

        it('should set canHideUgc to true', () => {
          component.ngOnInit();

          expect(component.canHideUgc).toBeTruthy();
        });
      });

      describe('When user does not have write permissions to hide UGC', () => {
        beforeEach(() => {
          mockPermissionsService.currentUserHasWritePermission = jasmine
            .createSpy('currentUserHasWritePermission')
            .and.returnValue(false);
        });

        it('should set canHideUgc to false', () => {
          component.ngOnInit();

          expect(component.canHideUgc).toBeFalsy();
        });
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
});
