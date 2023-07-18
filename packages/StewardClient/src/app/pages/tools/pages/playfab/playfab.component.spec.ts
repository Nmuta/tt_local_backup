import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockBackgroundJobService } from '@services/background-job/background-job.service.mock';
import { PlayFabComponent } from './playfab.component';

describe('PlayFabComponent', () => {
  let component: PlayFabComponent;
  let fixture: ComponentFixture<PlayFabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayFabComponent],
      providers: [createMockBackgroundJobService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayFabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
