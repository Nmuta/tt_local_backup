import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockGravityService } from '@services/gravity';

import { GravityPlayerInventoryComponent } from './gravity-player-inventory.component';

describe('GravityPlayerInventoryComponent', () => {
  let component: GravityPlayerInventoryComponent;
  let fixture: ComponentFixture<GravityPlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityPlayerInventoryComponent],
      providers: [createMockGravityService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
