import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PlayFabSettingsComponent } from './playfab-settings.component';
import { GameTitle } from '@models/enums';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'PlayFabSettingsComponent', () => {
  let component: PlayFabSettingsComponent;
  let fixture: ComponentFixture<PlayFabSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
          FormsModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatDialogModule,
          MatButtonToggleModule,
        ],
        declarations: [PlayFabSettingsComponent],
        providers: [],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(PlayFabSettingsComponent);
    component = fixture.componentInstance;
    component.title = GameTitle.FH5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
