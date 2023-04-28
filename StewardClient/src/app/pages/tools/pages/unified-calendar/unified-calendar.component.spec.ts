import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { UnifiedCalendarComponent } from './unified-calendar.component';

describe('UnifiedCalendarComponent', () => {
  let component: UnifiedCalendarComponent;
  let fixture: ComponentFixture<UnifiedCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnifiedCalendarComponent],
      providers: [createMockBackgroundJobService()],
    }).compileComponents();

    fixture = TestBed.createComponent(UnifiedCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
