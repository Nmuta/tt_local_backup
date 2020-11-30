import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

import { SettingsComponent } from './settings.component';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';

fdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([UserSettingsState])],
      declarations: [SettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of(<UserSettingsStateModel>{
      enableFakeApi: false,
    });
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
