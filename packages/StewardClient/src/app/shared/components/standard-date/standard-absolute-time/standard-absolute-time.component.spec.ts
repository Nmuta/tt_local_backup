import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime } from 'luxon';
import { LuxonModule } from 'luxon-angular';

import { StandardAbsoluteTimeComponent } from './standard-absolute-time.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'StandardAbsoluteTimeComponent', () => {
  let component: StandardAbsoluteTimeComponent;
  let fixture: ComponentFixture<StandardAbsoluteTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [StandardAbsoluteTimeComponent],
        imports: [PipesModule, LuxonModule, StandardCopyModule],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAbsoluteTimeComponent);
    component = fixture.componentInstance;
    component.timeUtc = DateTime.local().minus({ days: 15 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
