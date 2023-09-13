import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestateOMaticComponent } from './restate-o-matic.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'RestateOMaticComponent', () => {
  let component: RestateOMaticComponent;
  let fixture: ComponentFixture<RestateOMaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [RestateOMaticComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestateOMaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
