import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBanningComponent } from './user-banning.component';

describe('UserBanningComponent', () => {
  let component: UserBanningComponent;
  let fixture: ComponentFixture<UserBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBanningComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
