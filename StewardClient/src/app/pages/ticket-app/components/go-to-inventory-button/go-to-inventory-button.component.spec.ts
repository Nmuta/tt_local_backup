import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToInventoryButtonComponent } from './go-to-inventory-button.component';

describe('GoToInventoryButtonComponent', () => {
  let component: GoToInventoryButtonComponent;
  let fixture: ComponentFixture<GoToInventoryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoToInventoryButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToInventoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
