import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { BigintInterceptor } from '@interceptors/bigint.interceptor';
import { FakeApiInterceptor } from '@interceptors/fake-api/fake-api.interceptor';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { LoggerService } from '@services/logger/logger.service';
import { Clipboard } from '@shared/helpers/clipboard';
import { AccessTokenInterceptor } from '@shared/interceptors/access-token.interceptor';
import { UserState } from '@shared/state/user/user.state';
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ErrorComponent } from './pages/error/error.component';
import { SidebarsModule } from './sidebars/sidebars.module';

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
];

function fakeApiOrNothing(): Provider[] {
  if (!environment.enableFakeApi) {
    return [
      /* nothing */
    ];
  }

  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeApiInterceptor,
      multi: true,
    },
  ];
}

/** Defines the app module. */
@NgModule({
  declarations: [AppComponent, ErrorComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SidebarsModule,
    FontAwesomeModule,
    HttpClientModule,
    FourOhFourModule,
    NgxsModule.forRoot([UserState]),
    NgxsRouterPluginModule.forRoot(),
    MsalModule.forRoot(
      {
        auth: {
          clientId: environment.azureAppId,
          authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/',
          navigateToLoginRequestUrl: false,
          redirectUri: `${environment.stewardUiUrl}/auth/aad-login`,
          postLogoutRedirectUri: `${environment.stewardUiUrl}/auth/aad-logout`,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false, // set to true for IE 11
        },
      },
      {
        popUp: false,
        consentScopes: ['user.read', 'openid', 'profile', environment.azureAppScope],
        unprotectedResources: [],
        protectedResourceMap,
        extraQueryParameters: {},
      },
    ),
  ],
  providers: [
    {
      provide: ApplicationInsights,
      useFactory: () => {
        const appInsights = new ApplicationInsights({
          config: environment.appInsightsConfig,
        });
        appInsights.loadAppInsights();
        return appInsights;
      },
      multi: false,
    },
    LoggerService,
    Clipboard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BigintInterceptor,
      multi: true,
    },
    ...fakeApiOrNothing(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCopy, faUser);
  }
}
