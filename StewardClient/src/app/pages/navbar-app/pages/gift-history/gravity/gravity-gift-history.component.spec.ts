import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityGiftHistoryComponent } from './gravity-gift-history.component';

describe('GravityGiftHistoryComponent', () => {
  let component: GravityGiftHistoryComponent;
  let fixture: ComponentFixture<GravityGiftHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GravityGiftHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GravityGiftHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
