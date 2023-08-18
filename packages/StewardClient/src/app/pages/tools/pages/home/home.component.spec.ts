import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { createMockPermAttributesService } from '@services/perm-attributes/perm-attributes.service.mock';
import { of } from 'rxjs';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';

import { ToolsAppHomeComponent } from './home.component';

describe('ToolsAppHomeComponent', () => {
  let component: ToolsAppHomeComponent;
  let fixture: ComponentFixture<ToolsAppHomeComponent>;

  let mockPermAttributeService: PermAttributesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        imports: [MatAutocompleteModule, TourMatMenuModule],
        declarations: [ToolsAppHomeComponent],
        providers: [createMockPermAttributesService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ToolsAppHomeComponent);
    mockPermAttributeService = TestBed.inject(PermAttributesService);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'profile$', {
      value: of({
        role: UserRole.GeneralUser,
      } as UserModel),
    });

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of();

    Object.defineProperty(mockPermAttributeService, 'initializationGuard$', { value: of(null) });
    mockPermAttributeService.hasFeaturePermission = jasmine
      .createSpy('hasFeaturePermission')
      .and.returnValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    beforeEach(() => {
      component.permInitializationActionMonitor =
        component.permInitializationActionMonitor.repeat();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component.availableTiles.all.length).not.toEqual(0);
    });
  });
});
