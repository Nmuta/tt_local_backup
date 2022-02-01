import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

import { UserBanningComponent } from './user-banning.component';

describe('UserBanningComponent', () => {
  let component: UserBanningComponent;
  let fixture: ComponentFixture<UserBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBanningComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBanningComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When environment.production is true', () => {
      beforeEach(() => {
        environment.production = true;
      });

      it('should set navbar tool list correct', () => {
        fixture.detectChanges();

        expect(component.navbarRouterLinks.length).toEqual(3);
      });
    });

    describe('When environment.production is false', () => {
      beforeEach(() => {
        environment.production = false;
      });

      it('should set navbar tool list correct', () => {
        fixture.detectChanges();

        expect(component.navbarRouterLinks.length).toEqual(4);
      });
    });
  });
});
