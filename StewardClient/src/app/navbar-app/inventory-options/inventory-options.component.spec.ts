// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  getTestBed,
  waitForAsync,
} from '@angular/core/testing';

// Components
import { InventoryOptionsComponent } from './inventory-options.component';

describe('InventoryOptionsComponent', () => {
  let fixture: ComponentFixture<InventoryOptionsComponent>;
  let component: InventoryOptionsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [InventoryOptionsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryOptionsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
