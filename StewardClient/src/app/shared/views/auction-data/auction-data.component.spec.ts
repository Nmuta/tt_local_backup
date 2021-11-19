import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockSunriseService } from '@services/sunrise';

import { AuctionDataComponent } from './auction-data.component';

describe('AuctionDataComponent (view)', () => {
  let component: AuctionDataComponent;
  let fixture: ComponentFixture<AuctionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionDataComponent],
      imports: [RouterTestingModule],
      providers: [createMockSunriseService()],
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
