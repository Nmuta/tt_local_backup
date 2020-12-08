import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityGiftingComponent } from './gravity-gifting.component';

describe('GravityGiftingComponent', () => {
  let component: GravityGiftingComponent;
  let fixture: ComponentFixture<GravityGiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GravityGiftingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
