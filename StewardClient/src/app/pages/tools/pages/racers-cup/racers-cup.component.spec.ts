import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { RacersCupComponent } from './racers-cup.component';

describe('RacersCupComponent', () => {
  let component: RacersCupComponent;
  let fixture: ComponentFixture<RacersCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RacersCupComponent],
      providers: [createMockBackgroundJobService()],
    }).compileComponents();

    fixture = TestBed.createComponent(RacersCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
