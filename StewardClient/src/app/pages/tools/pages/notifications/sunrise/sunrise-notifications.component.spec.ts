import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SunriseNotificationsComponent } from './sunrise-notifications.component';

describe('SunriseNotificationsComponent', () => {
  let component: SunriseNotificationsComponent;
  let fixture: ComponentFixture<SunriseNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SunriseNotificationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SunriseNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SunriseNotificationsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
