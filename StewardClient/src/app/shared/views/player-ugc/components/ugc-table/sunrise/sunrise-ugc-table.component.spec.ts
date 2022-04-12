import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SunriseUgcTableComponent } from './sunrise-ugc-table.component';
import { fakePlayerUgcItem } from '@models/player-ugc-item';
import { EMPTY } from 'rxjs';
import { SunriseService } from '@services/sunrise';
import { PlayerUgcItemTableEntries } from '../ugc-table.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

describe('SunriseUgcTableComponent', () => {
  let component: SunriseUgcTableComponent;
  let fixture: ComponentFixture<SunriseUgcTableComponent>;
  let mockSunriseService: SunriseService;
  let mockMatDialog;
  MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [SunriseUgcTableComponent, BigJsonPipe],
      providers: [
        createMockSunriseService(),
        {
          provide: MatDialog,
          useValue: { open: () => MatDialogRef },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseUgcTableComponent);
    component = fixture.componentInstance;
    mockMatDialog = TestBed.inject(MatDialog);
    mockSunriseService = TestBed.inject(SunriseService);

    fixture.detectChanges();

    mockMatDialog.open = jasmine.createSpy('open').and.returnValue({ afterClosed: () => EMPTY });
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Method: hideUgcItem', () => {
    const item: PlayerUgcItemTableEntries = fakePlayerUgcItem();
    item.monitor = new ActionMonitor();

    it('should call SunriseService.hideUgc$()', () => {
      component.hideUgcItem(item);

      expect(mockSunriseService.hideUgc$).toHaveBeenCalled();
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
