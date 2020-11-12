// General
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

// Components
import { InventoryComponent } from './inventory.component';

describe('InventoryComponent', () => {
  let fixture: ComponentFixture<InventoryComponent>;
  let component: InventoryComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [InventoryComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(InventoryComponent);
      component = fixture.debugElement.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
