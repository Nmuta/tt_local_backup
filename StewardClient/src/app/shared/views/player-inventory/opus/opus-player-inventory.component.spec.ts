import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusPlayerInventoryComponent } from './opus-player-inventory.component';

describe('OpusPlayerInventoryComponent', () => {
  let component: OpusPlayerInventoryComponent;
  let fixture: ComponentFixture<OpusPlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusPlayerInventoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusPlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
