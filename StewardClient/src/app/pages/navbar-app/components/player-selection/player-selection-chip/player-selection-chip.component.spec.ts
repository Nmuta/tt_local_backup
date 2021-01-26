import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectionChipComponent } from './player-selection-chip.component';

describe('PlayerSelectionChipComponent', () => {
  let component: PlayerSelectionChipComponent;
  let fixture: ComponentFixture<PlayerSelectionChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSelectionChipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
