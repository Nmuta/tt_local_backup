import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectionChipListComponent } from './player-selection-chip-list.component';

describe('PlayerSelectionChipListComponent', () => {
  let component: PlayerSelectionChipListComponent;
  let fixture: ComponentFixture<PlayerSelectionChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSelectionChipListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
