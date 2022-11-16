import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { OldPermissionsService, createMockPermissionsService } from '@services/permissions';
import { PipesModule } from '@shared/pipes/pipes.module';

import { WoodstockLookupComponent } from './woodstock-lookup.component';

describe('WoodstockLookupComponent', () => {
  let component: WoodstockLookupComponent;
  let fixture: ComponentFixture<WoodstockLookupComponent>;
  let mockPermissionService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockLookupComponent],
      imports: [
        PipesModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
        MatDialogModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockPermissionsService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockLookupComponent);
    component = fixture.componentInstance;
    mockPermissionService = TestBed.inject(OldPermissionsService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When user has write permissions', () => {
      beforeEach(() => {
        mockPermissionService.currentUserHasWritePermission = jasmine
          .createSpy('currentUserHasWritePermission')
          .and.returnValue(true);
      });

      it('should set userHasWritePerms to true', () => {
        fixture.detectChanges();

        expect(component.userHasWritePerms).toBeTruthy();
      });
    });

    describe('When user does not have write permissions', () => {
      beforeEach(() => {
        mockPermissionService.currentUserHasWritePermission = jasmine
          .createSpy('currentUserHasWritePermission')
          .and.returnValue(false);
      });

      it('should set userHasWritePerms to false', () => {
        fixture.detectChanges();

        expect(component.userHasWritePerms).toBeFalsy();
      });
    });
  });
});
