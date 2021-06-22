import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createMockWoodstockService } from '@services/woodstock';

import { WoodstockCommunityMessagingComponent } from './woodstock-community-messaging.component';

describe('WoodstockCommunityMessagingComponent', () => {
  let component: WoodstockCommunityMessagingComponent;
  let fixture: ComponentFixture<WoodstockCommunityMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockCommunityMessagingComponent],
      providers: [createMockWoodstockService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockCommunityMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
