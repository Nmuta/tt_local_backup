import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeCenterCalendarComponent } from './welcome-center-calendar.component';

describe('WelcomeCenterCalendarComponent', () => {
  let component: WelcomeCenterCalendarComponent;
  let fixture: ComponentFixture<WelcomeCenterCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeCenterCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeCenterCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
