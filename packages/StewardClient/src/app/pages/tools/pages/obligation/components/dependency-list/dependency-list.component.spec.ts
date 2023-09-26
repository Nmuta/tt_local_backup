import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

import { DependencyListComponent } from './dependency-list.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('DependencyListComponent', () => {
  let component: DependencyListComponent;
  let fixture: ComponentFixture<DependencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [DependencyListComponent],
        imports: [MatAutocompleteModule],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
