import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSunriseService } from '@services/sunrise';

import { SunriseCommunityMessagingComponent } from './sunrise-community-messaging.component';

describe('SunriseCommunityMessagingComponent', () => {
  let component: SunriseCommunityMessagingComponent;
  let fixture: ComponentFixture<SunriseCommunityMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseCommunityMessagingComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseCommunityMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
