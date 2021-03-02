import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ErrorComponent } from './pages/error/error.component';
import { SidebarsModule } from './sidebars/sidebars.module';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ZafClientService } from '@services/zendesk/zaf-client.service';
import { UtcInterceptor } from '@interceptors/utc.interceptor';

// States
import { UserState } from '@shared/state/user/user.state';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { GravityGiftingState } from '@navbar-app/pages/gifting/gravity/state/gravity-gifting.state';
import { SunriseGiftingState } from '@navbar-app/pages/gifting/sunrise/state/sunrise-gifting.state';
import { ApolloGiftingState } from '@navbar-app/pages/gifting/apollo/state/apollo-gifting.state';
import { TitleMemoryState } from '@shared/state/title-memory/title-memory.state';
import { MatNativeDateModule } from '@angular/material/core';
import { LspGroupMemoryState } from '@shared/state/lsp-group-memory/lsp-group-memory.state';
import { GravityGiftHistoryState } from '@navbar-app/pages/gift-history/gravity/state/gravity-gift-history.state';
import { SunriseGiftHistoryState } from '@navbar-app/pages/gift-history/sunrise/state/sunrise-gift-history.state';
import { ApolloGiftHistoryState } from '@navbar-app/pages/gift-history/apollo/state/apollo-gift-history.state';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { AvailableAppsModule } from '@shared/views/available-apps/available-apps.module';
import { StoreForeverStrategy } from '@helpers/route-reuse-strategy/store-forever-strategy';
import { RouteReuseStrategy } from '@angular/router';

const protectedResourceMap: [string, string[]][] = [
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
    MatCardModule,
    MatNativeDateModule,
    CenterContentsModule,
    FlexLayoutModule,
    AvailableAppsModule,
    NgxsModule.forRoot([
      UserState,
      UserSettingsState,
      TitleMemoryState,
      MasterInventoryListMemoryState,
      LspGroupMemoryState,
      // Gifting page states
      GravityGiftingState,
      SunriseGiftingState,
      ApolloGiftingState,
      // Gift History page states
      GravityGiftHistoryState,
      SunriseGiftHistoryState,
      ApolloGiftHistoryState,
    ]),
    NgxsStoragePluginModule.forRoot({ key: [UserSettingsState, UserState] }),
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
    ZafClientService,
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
    { provide: RouteReuseStrategy, useClass: StoreForeverStrategy },
    Clipboard,
    ...fakeApiOrNothing(),
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
      useClass: UtcInterceptor,
      multi: true,
    },
    {
      // this has to be the last interceptor, since it changes the type of the request to 'text'
      provide: HTTP_INTERCEPTORS,
      useClass: BigintInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCopy, faUser);
  }
}
