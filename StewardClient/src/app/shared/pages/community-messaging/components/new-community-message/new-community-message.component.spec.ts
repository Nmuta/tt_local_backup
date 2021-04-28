import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { NewCommunityMessageComponent } from './new-community-message.component';
import { FormBuilder } from '@angular/forms';

describe('NewCommunityMessageComponent', () => {
  let fixture: ComponentFixture<NewCommunityMessageComponent>;
  let component: NewCommunityMessageComponent;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [NewCommunityMessageComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockWindowService(),
          createMockMsalService(),
          createMockZendeskService(),
          createMockLoggerService(),
          { provide: FormBuilder, useValue: formBuilder },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NewCommunityMessageComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
