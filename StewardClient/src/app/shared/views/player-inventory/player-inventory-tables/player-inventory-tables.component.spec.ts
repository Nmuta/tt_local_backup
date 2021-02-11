import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInventoryTablesComponent } from './player-inventory-tables.component';

describe('PlayerInventoryTablesComponent', () => {
  let component: PlayerInventoryTablesComponent;
  let fixture: ComponentFixture<PlayerInventoryTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerInventoryTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerInventoryTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
