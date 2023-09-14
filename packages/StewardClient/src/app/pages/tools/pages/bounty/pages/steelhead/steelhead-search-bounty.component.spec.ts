import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockSteelheadBountiesService } from '@services/api-v2/steelhead/bounties/steelhead-bounties.service.mock';
import { SteelheadSearchBountyComponent } from './steelhead-search-bounty.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('SteelheadSearchBountyComponent', () => {
  let fixture: ComponentFixture<SteelheadSearchBountyComponent>;
  let component: SteelheadSearchBountyComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          ReactiveFormsModule,
          MatAutocompleteModule,
        ],
        declarations: [SteelheadSearchBountyComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockSteelheadBountiesService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(SteelheadSearchBountyComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
