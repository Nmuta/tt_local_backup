import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuctionDataComponent } from './auction-data.component';

describe('AuctionDataComponent (page)', () => {
  let component: AuctionDataComponent;
  let fixture: ComponentFixture<AuctionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDataComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
