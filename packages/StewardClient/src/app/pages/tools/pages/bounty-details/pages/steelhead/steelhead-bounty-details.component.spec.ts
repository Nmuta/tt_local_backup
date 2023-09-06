import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { createMockSteelheadBountiesService } from '@services/api-v2/steelhead/bounties/steelhead-bounties.service.mock';
import { SteelheadBountyDetailsComponent } from './steelhead-bounty-details.component';

describe('SteelheadBountyDetailsComponent', () => {
  let fixture: ComponentFixture<SteelheadBountyDetailsComponent>;
  let component: SteelheadBountyDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [SteelheadBountyDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadBountiesService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadBountyDetailsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
