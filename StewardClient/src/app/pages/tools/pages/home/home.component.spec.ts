import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { of } from 'rxjs';

import { ToolsAppHomeComponent } from './home.component';

describe('ToolsAppHomeComponent', () => {
  let component: ToolsAppHomeComponent;
  let fixture: ComponentFixture<ToolsAppHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        imports: [MatAutocompleteModule],
        declarations: [ToolsAppHomeComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ToolsAppHomeComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'profile$', { writable: true });
    component.profile$ = of();

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
