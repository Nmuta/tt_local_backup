import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeCenterTilesComponent } from './welcome-center-tiles.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('MessageOfTheDayComponent', () => {
  let component: WelcomeCenterTilesComponent;
  let fixture: ComponentFixture<WelcomeCenterTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [WelcomeCenterTilesComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(WelcomeCenterTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
