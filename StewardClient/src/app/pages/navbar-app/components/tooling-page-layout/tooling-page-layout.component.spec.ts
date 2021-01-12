import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserState } from '@shared/state/user/user.state';
import { createMockMsalService } from '@shared/mocks/msal.service.mock';
import { ToolingPageLayoutComponent } from './tooling-page-layout.component';
import { createMockWindowService } from '@services/window';
import { createMockZendeskService } from '@services/zendesk';

describe('ToolingPageLayoutComponent', () => {
  let fixture: ComponentFixture<ToolingPageLayoutComponent>;
  let component: ToolingPageLayoutComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot([UserState]),
        ],
        declarations: [ToolingPageLayoutComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockWindowService(), createMockMsalService(), createMockZendeskService()],
      }).compileComponents();

      fixture = TestBed.createComponent(ToolingPageLayoutComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
