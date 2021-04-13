import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityMessagingComponent } from './community-messaging.component';

describe('CommunityMessagingComponent', () => {
  let component: CommunityMessagingComponent;
  let fixture: ComponentFixture<CommunityMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityMessagingComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
