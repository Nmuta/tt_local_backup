import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockSteelheadService } from '@services/steelhead';

import { SteelheadCommunityMessagingComponent } from './steelhead-community-messaging.component';

describe('SteelheadCommunityMessagingComponent', () => {
  let component: SteelheadCommunityMessagingComponent;
  let fixture: ComponentFixture<SteelheadCommunityMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadCommunityMessagingComponent],
      providers: [createMockSteelheadService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadCommunityMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
