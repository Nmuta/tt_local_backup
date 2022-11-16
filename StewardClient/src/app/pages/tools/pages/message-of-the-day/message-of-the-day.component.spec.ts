import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageOfTheDayComponent } from './message-of-the-day.component';

describe('MessageOfTheDayComponent', () => {
  let component: MessageOfTheDayComponent;
  let fixture: ComponentFixture<MessageOfTheDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageOfTheDayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
