import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createMockApolloService } from '@services/apollo/apollo.service.mock';
import { BigJsonPipe } from '@shared/pipes/big-json.pipe';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloUgcTableComponent } from './apollo-ugc-table.component';
import { fakePlayerUgcItem } from '@models/player-ugc-item';
import { EMPTY } from 'rxjs';
import { PlayerUgcItemTableEntries } from '../ugc-table.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { createMockPermissionsService, PermissionsService } from '@services/permissions';

describe('ApolloUgcTableComponent', () => {
  let component: ApolloUgcTableComponent;
  let fixture: ComponentFixture<ApolloUgcTableComponent>;
  let mockPermissionsService: PermissionsService;
  let mockMatDialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatPaginatorModule, BrowserAnimationsModule],
      declarations: [ApolloUgcTableComponent, BigJsonPipe],
      providers: [
        createMockApolloService(),
        createMockPermissionsService(),
        {
          provide: MatDialog,
          useValue: { open: () => MatDialogRef },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ApolloUgcTableComponent);
    component = fixture.componentInstance;
    mockMatDialog = TestBed.inject(MatDialog);
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

    it('should throw error', () => {
      try {
        component.hideUgcItem(item);
        expect(false).toBeTruthy();
      } catch (e) {
        expect(e.message).toEqual('Apollo does not support hiding UGC');
      }
    });
  });

  describe('Method: openFeatureUgcModal', () => {
    const item = fakePlayerUgcItem();

    it('should throw error', () => {
      try {
        component.openFeatureUgcModal(item);
        expect(false).toBeTruthy();
      } catch (e) {
        expect(e.message).toEqual('Apollo does not support featuring UGC');
      }
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
});
