import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleListComponent } from './toggle-list.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ToggleListComponent', () => {
  let component: ToggleListComponent;
  let fixture: ComponentFixture<ToggleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ToggleListComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
