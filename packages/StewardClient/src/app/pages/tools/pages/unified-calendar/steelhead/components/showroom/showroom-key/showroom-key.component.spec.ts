import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowroomKeyComponent } from './showroom-key.component';
import { ShowroomEventType } from '../showroom-calendar-view/steelhead/steelhead-showroom-calendar-view.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ShowroomKeyComponent', () => {
  let component: ShowroomKeyComponent;
  let fixture: ComponentFixture<ShowroomKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [ShowroomKeyComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomKeyComponent);
    component = fixture.componentInstance;
    component.toggleChecked(ShowroomEventType.CarSale);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
