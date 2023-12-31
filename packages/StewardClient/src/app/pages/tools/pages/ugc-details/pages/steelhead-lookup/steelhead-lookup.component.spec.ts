import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockOldPermissionsService, OldPermissionsService } from '@services/old-permissions';
import { PipesModule } from '@shared/pipes/pipes.module';

import { SteelheadLookupComponent } from './steelhead-lookup.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadLookupComponent', () => {
  let component: SteelheadLookupComponent;
  let fixture: ComponentFixture<SteelheadLookupComponent>;
  let mockPermissionService: OldPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [SteelheadLookupComponent],
        imports: [
          PipesModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          MatDialogModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockOldPermissionsService()],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadLookupComponent);
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
