import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSteelheadPlayerDriverLevelService } from '@services/api-v2/steelhead/player/driver-level/steelhead-player-driver-level.service.mock';
import { SteelheadUgcProfileComponent } from './steelhead-ugc-profile.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadUgcProfileComponent', () => {
  let component: SteelheadUgcProfileComponent;
  let fixture: ComponentFixture<SteelheadUgcProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [HttpClientTestingModule, NgxsModule.forRoot()],
        declarations: [SteelheadUgcProfileComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockSteelheadPlayerDriverLevelService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadUgcProfileComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
