import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { WoodstockPlayFabBuildsManagementComponent } from './woodstock-playfab-builds-management.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockPlayFabBuildsManagementComponent', () => {
  let component: WoodstockPlayFabBuildsManagementComponent;
  let fixture: ComponentFixture<WoodstockPlayFabBuildsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([]),
        ],
        declarations: [WoodstockPlayFabBuildsManagementComponent],
        providers: [],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(WoodstockPlayFabBuildsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
