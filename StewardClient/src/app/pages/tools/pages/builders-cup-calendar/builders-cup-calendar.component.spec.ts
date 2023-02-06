import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildersCupCalendarComponent } from './builders-cup-calendar.component';

describe('BuildersCupCalendarComponent', () => {
  let component: BuildersCupCalendarComponent;
  let fixture: ComponentFixture<BuildersCupCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildersCupCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildersCupCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
