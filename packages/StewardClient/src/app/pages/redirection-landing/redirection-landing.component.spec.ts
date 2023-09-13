import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionLandingComponent } from './redirection-landing.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'RedirectionLandingComponent', () => {
  let component: RedirectionLandingComponent;
  let fixture: ComponentFixture<RedirectionLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [RedirectionLandingComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(RedirectionLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
