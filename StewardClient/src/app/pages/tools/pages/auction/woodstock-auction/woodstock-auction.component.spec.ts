import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockWoodstockService } from '@services/woodstock';
import { PipesModule } from '@shared/pipes/pipes.module';

import { WoodstockAuctionComponent } from './woodstock-auction.component';

describe('WoodstockAuctionComponent', () => {
  let component: WoodstockAuctionComponent;
  let fixture: ComponentFixture<WoodstockAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockAuctionComponent],
      imports: [RouterTestingModule, PipesModule],
      providers: [createMockWoodstockService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
