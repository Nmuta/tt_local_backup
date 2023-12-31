import { ComponentFixture, TestBed } from '@angular/core/testing';

import { setUserProfile } from '@mocks/standard-test-module-helpers';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { TourState } from '@shared/state/tours/tours.state';
import { createMockUserTourService } from '@tools-app/pages/home/tour/tour.service.mock';
import { EndpointsComponent } from './endpoints.component';

describe('EndpointsComponent', () => {
  let component: EndpointsComponent;
  let fixture: ComponentFixture<EndpointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [EndpointsComponent],
        ngxsModules: [EndpointKeyMemoryState, TourState],
        imports: [],
        providers: [createMockUserTourService()],
      }),
    ).compileComponents();

    setUserProfile();

    fixture = TestBed.createComponent(EndpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
