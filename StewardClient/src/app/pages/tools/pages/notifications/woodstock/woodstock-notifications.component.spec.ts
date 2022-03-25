import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WoodstockNotificationsComponent } from './woodstock-notifications.component';

describe('SunriseNotificationsComponent', () => {
  let component: WoodstockNotificationsComponent;
  let fixture: ComponentFixture<WoodstockNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockNotificationsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [WoodstockNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockNotificationsComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
