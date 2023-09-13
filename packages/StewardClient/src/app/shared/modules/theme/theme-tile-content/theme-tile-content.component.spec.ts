import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTileContentComponent } from './theme-tile-content.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ThemeTileContentComponent', () => {
  let component: ThemeTileContentComponent;
  let fixture: ComponentFixture<ThemeTileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ThemeTileContentComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
