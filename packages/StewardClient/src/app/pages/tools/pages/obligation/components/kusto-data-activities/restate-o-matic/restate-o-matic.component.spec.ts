import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestateOMaticComponent } from './restate-o-matic.component';

describe('RestateOMaticComponent', () => {
  let component: RestateOMaticComponent;
  let fixture: ComponentFixture<RestateOMaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestateOMaticComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestateOMaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
