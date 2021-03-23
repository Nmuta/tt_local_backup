import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityHomeComponent } from './home.component';

describe('CommunityHomeComponent', () => {
  let component: CommunityHomeComponent;
  let fixture: ComponentFixture<CommunityHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityHomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
