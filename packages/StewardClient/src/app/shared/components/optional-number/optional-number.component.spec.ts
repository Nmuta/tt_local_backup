import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalNumberComponent } from './optional-number.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('OptionalNumberComponent', () => {
  let component: OptionalNumberComponent;
  let fixture: ComponentFixture<OptionalNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [OptionalNumberComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
