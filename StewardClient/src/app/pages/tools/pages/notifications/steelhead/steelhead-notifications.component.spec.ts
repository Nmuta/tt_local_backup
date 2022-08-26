import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SteelheadNotificationsComponent } from './steelhead-notifications.component';

describe('SunriseNotificationsComponent', () => {
  let component: SteelheadNotificationsComponent;
  let fixture: ComponentFixture<SteelheadNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadNotificationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [SteelheadNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SteelheadNotificationsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
