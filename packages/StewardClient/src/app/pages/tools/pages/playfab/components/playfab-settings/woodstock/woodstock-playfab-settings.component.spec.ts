import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockPlayFabSettingsComponent } from './woodstock-playfab-settings.component';
import { GameTitle } from '@models/enums';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayFabSettingsComponent', () => {
  let component: WoodstockPlayFabSettingsComponent;
  let fixture: ComponentFixture<WoodstockPlayFabSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
        ],
        declarations: [WoodstockPlayFabSettingsComponent],
        providers: [],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayFabSettingsComponent);
    component = fixture.componentInstance;
    component.title = GameTitle.FH5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
