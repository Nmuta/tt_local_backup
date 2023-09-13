import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacersCupKeyComponent } from './racers-cup-key.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'RacersCupKeyComponent', () => {
  let component: RacersCupKeyComponent;
  let fixture: ComponentFixture<RacersCupKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [RacersCupKeyComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacersCupKeyComponent);
    component = fixture.componentInstance;
    component.filterCriteria = new Map<string, string[]>();
    component.filterCriteria.set('testSeries', ['testPlaylist1', 'testPlaylist2', 'testPlaylist3']);
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
