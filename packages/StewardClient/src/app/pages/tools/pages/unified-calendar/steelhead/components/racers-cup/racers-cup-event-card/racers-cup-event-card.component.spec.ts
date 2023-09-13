import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacersCupEventCardComponent } from './racers-cup-event-card.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('RacersCupEventCardComponent', () => {
  let component: RacersCupEventCardComponent;
  let fixture: ComponentFixture<RacersCupEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [RacersCupEventCardComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacersCupEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
