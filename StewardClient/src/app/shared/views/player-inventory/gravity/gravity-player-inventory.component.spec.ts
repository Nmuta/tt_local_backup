import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityPlayerInventoryComponent } from './gravity-player-inventory.component';

describe('GravityPlayerInventoryComponent', () => {
  let component: GravityPlayerInventoryComponent;
  let fixture: ComponentFixture<GravityPlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityPlayerInventoryComponent],
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
