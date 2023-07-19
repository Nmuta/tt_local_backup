import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { WoodstockCreateSingleAuctionComponent } from './woodstock-create-single-auction.component';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WoodstockCreateSingleAuctionComponent', () => {
  let component: WoodstockCreateSingleAuctionComponent;
  let fixture: ComponentFixture<WoodstockCreateSingleAuctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockCreateSingleAuctionComponent, HumanizePipe],
      imports: [PipesModule, HttpClientTestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockCreateSingleAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
