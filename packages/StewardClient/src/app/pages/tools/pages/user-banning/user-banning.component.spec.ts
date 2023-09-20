import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBanningComponent } from './user-banning.component';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('UserBanningComponent', () => {
  let component: UserBanningComponent;
  let fixture: ComponentFixture<UserBanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [UserBanningComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(UserBanningComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set navbar tool list correct', () => {
    fixture.detectChanges();

    expect(component.navbarRouterLinks.length).toEqual(5);
  });
});
