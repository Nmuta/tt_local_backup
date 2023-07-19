import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteelheadBuildersCupSeriesCardComponent } from './steelhead-builders-cup-series-card.component';

describe('SteelheadBuildersCupSeriesCardComponent', () => {
  let component: SteelheadBuildersCupSeriesCardComponent;
  let fixture: ComponentFixture<SteelheadBuildersCupSeriesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadBuildersCupSeriesCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadBuildersCupSeriesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
