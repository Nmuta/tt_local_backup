import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursComponent } from './tours.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { TourState } from '@shared/state/tours/tours.state';
import { createMockUserTourService } from '@tools-app/pages/home/tour/tour.service.mock';

describe('ToursComponent', () => {
  let component: ToursComponent;
  let fixture: ComponentFixture<ToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [ToursComponent],
        ngxsModules: [EndpointKeyMemoryState, TourState],
        imports: [],
        providers: [createMockUserTourService()],
      }))
    .compileComponents();

    fixture = TestBed.createComponent(ToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
