import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunrisePlayerInventoryComponent } from './sunrise.component';

describe('SunriseComponent', () => {
  let component: SunrisePlayerInventoryComponent;
  let fixture: ComponentFixture<SunrisePlayerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SunrisePlayerInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunrisePlayerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
