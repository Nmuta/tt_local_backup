import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadLeaderboardsComponent } from './steelhead-leaderboards.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('WoodstockLeaderboardsComponent', () => {
  let component: SteelheadLeaderboardsComponent;
  let fixture: ComponentFixture<SteelheadLeaderboardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          BrowserAnimationsModule,
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
        ],
        declarations: [SteelheadLeaderboardsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadLeaderboardsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
