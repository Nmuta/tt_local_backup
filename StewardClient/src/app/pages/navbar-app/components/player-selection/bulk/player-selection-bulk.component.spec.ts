import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSelectionBulkComponent } from './player-selection-bulk.component';

describe('PlayerSelectionBulkComponent', () => {
  let component: PlayerSelectionBulkComponent;
  let fixture: ComponentFixture<PlayerSelectionBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerSelectionBulkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSelectionBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
