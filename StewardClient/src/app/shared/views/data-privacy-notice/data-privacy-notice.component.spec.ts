import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPrivacyNoticeComponent } from './data-privacy-notice.component';

describe('DataPrivacyNoticeComponent', () => {
  let component: DataPrivacyNoticeComponent;
  let fixture: ComponentFixture<DataPrivacyNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataPrivacyNoticeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPrivacyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
