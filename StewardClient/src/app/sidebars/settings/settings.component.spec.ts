import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';

import { SettingsComponent } from './settings.component';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { UserModel } from '@models/user.model';
import { UserRole } from '@models/enums';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  let mockStore: Store;

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

    mockStore = TestBed.inject(Store);
    mockStore.selectSnapshot = jasmine.createSpy('selectSnapshot').and.returnValue({
      emailAddress: 'fake-email',
      name: 'fake-name',
      role: UserRole.LiveOpsAdmin,
    } as UserModel);
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
