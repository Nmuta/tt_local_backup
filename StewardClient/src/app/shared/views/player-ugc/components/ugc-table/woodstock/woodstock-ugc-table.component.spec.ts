import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakePlayerUGCItem } from '@models/player-ugc-item';
import { WoodstockUGCTableComponent } from './woodstock-ugc-table.component';
import { createMockWoodstockService, WoodstockService } from '@services/woodstock';
import { EMPTY } from 'rxjs';
import { PlayerUGCItemTableEntries } from '../ugc-table.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

describe('WoodstockUGCTableComponent', () => {
  let component: WoodstockUGCTableComponent;
  let fixture: ComponentFixture<WoodstockUGCTableComponent>;
  let mockWoodstockService: WoodstockService;
  let mockMatDialog;

  MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [WoodstockUGCTableComponent, BigJsonPipe],
      providers: [
        createMockWoodstockService(),
        {
          provide: MatDialog,
          useValue: { open: () => MatDialogRef },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockUGCTableComponent);
    component = fixture.componentInstance;
    mockMatDialog = TestBed.inject(MatDialog);
    mockWoodstockService = TestBed.inject(WoodstockService);

    fixture.detectChanges();

    mockMatDialog.open = jasmine.createSpy('open').and.returnValue({ afterClosed: () => EMPTY });
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: hideUGCItem', () => {
    const item: PlayerUGCItemTableEntries = fakePlayerUGCItem();
    item.monitor = new ActionMonitor();

    it('should call WoodstockService.hideUgc$()', () => {
      component.hideUGCItem(item);

      expect(mockWoodstockService.hideUgc$).toHaveBeenCalled();
    });
  });

  describe('Method: openFeatureUGCModal', () => {
    const item = fakePlayerUGCItem();

    it('should call MatDialog.open()', () => {
      component.openFeatureUGCModal(item);

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
