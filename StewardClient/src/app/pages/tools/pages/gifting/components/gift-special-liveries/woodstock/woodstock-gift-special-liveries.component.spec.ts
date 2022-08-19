import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoodstockGiftSpecialLiveriesComponent } from './woodstock-gift-special-liveries.component';

describe('WoodstockGiftSpecialLiveryComponent', () => {
  let component: WoodstockGiftSpecialLiveriesComponent;
  let fixture: ComponentFixture<WoodstockGiftSpecialLiveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoodstockGiftSpecialLiveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockGiftSpecialLiveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
