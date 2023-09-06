import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarsComponent } from './sidebars.component';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { TourState } from '@shared/state/tours/tours.state';
import { createMockUserTourService } from '@tools-app/pages/home/tour/tour.service.mock';
import { MatDialogModule } from '@angular/material/dialog';
import { ChangelogState } from '@shared/state/changelog/changelog.state';

describe('SidebarsComponent', () => {
  let component: SidebarsComponent;
  let fixture: ComponentFixture<SidebarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({
        declarations: [SidebarsComponent],
        ngxsModules: [EndpointKeyMemoryState, TourState, ChangelogState],
        imports: [MatDialogModule],
        providers: [createMockUserTourService()],
      }))
    .compileComponents();

    fixture = TestBed.createComponent(SidebarsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
