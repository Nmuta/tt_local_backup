import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInventoryProfilesPickerComponent } from './player-inventory-profiles-picker.base.component';

describe('PlayerInventoryProfilesPickerComponent', () => {
  let component: PlayerInventoryProfilesPickerComponent;
  let fixture: ComponentFixture<PlayerInventoryProfilesPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerInventoryProfilesPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerInventoryProfilesPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
