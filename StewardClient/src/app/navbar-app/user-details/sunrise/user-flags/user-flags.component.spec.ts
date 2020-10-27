import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlagsComponent } from './user-flags.component';

describe('UserFlagsComponent', () => {
  let component: UserFlagsComponent;
  let fixture: ComponentFixture<UserFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFlagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
