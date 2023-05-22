import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowroomCalendarComponent } from './showroom-calendar.component';

describe('ShowroomCalendarComponent', () => {
  let component: ShowroomCalendarComponent;
  let fixture: ComponentFixture<ShowroomCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowroomCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowroomCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
