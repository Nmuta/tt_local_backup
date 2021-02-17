import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';

import { PlayerInventoryTablesComponent } from './player-inventory-tables.component';

describe('PlayerInventoryTablesComponent', () => {
  let component: PlayerInventoryTablesComponent;
  let fixture: ComponentFixture<PlayerInventoryTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerInventoryTablesComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
