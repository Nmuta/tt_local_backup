import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RacersCupInputsComponent } from './racers-cup-inputs.component';

describe('RacersCupInputsComponent', () => {
  let component: RacersCupInputsComponent;
  let fixture: ComponentFixture<RacersCupInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RacersCupInputsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacersCupInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
