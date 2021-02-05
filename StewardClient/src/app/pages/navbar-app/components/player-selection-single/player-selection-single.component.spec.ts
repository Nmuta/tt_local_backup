import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectionSingleComponent } from './player-selection-single.component';

describe('PlayerSelectionSingleComponent', () => {
  let component: PlayerSelectionSingleComponent;
  let fixture: ComponentFixture<PlayerSelectionSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerSelectionSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
