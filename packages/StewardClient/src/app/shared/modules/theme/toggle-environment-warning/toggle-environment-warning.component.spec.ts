import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { ThemeService } from '../theme.service';

import { ToggleEnvironmentWarningComponent } from './toggle-environment-warning.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('ToggleEnvironmentWarningComponent', () => {
  let component: ToggleEnvironmentWarningComponent;
  let fixture: ComponentFixture<ToggleEnvironmentWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ToggleEnvironmentWarningComponent],
        imports: [NgxsModule.forRoot()],
        providers: [ThemeService],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleEnvironmentWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
