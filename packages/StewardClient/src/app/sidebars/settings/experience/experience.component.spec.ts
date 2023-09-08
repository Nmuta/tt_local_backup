import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceComponent } from './experience.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { TourState } from '@shared/state/tours/tours.state';
import { createMockUserTourService } from '@tools-app/pages/home/tour/tour.service.mock';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ExperienceComponent],
        ngxsModules: [EndpointKeyMemoryState, TourState],
        imports: [],
        providers: [createMockUserTourService()],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
