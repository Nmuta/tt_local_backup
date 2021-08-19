import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createMockMsalService } from '@mocks/msal.service.mock';
import { NgxsModule } from '@ngxs/store';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { of } from 'rxjs';

import { ToolsAppHomeComponent } from './home.component';

describe('ToolsAppHomeComponent', () => {
  let component: ToolsAppHomeComponent;
  let fixture: ComponentFixture<ToolsAppHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState, UserSettingsState]),
        PipesModule,
      ],
      declarations: [ToolsAppHomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        createMockWindowService(),
        createMockMsalService(),
        createMockZendeskService(),
        createMockLoggerService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsAppHomeComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'profile$', { writable: true });
    component.profile$ = of();

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
