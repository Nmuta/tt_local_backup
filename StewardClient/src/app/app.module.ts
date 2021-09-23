import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { BigNumberInterceptor } from '@interceptors/bigint.interceptor';
import { FakeApiInterceptor } from '@interceptors/fake-api/fake-api.interceptor';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { LoggerService } from '@services/logger/logger.service';
import { Clipboard } from '@shared/helpers/clipboard';
import { AccessTokenInterceptor } from '@shared/interceptors/access-token.interceptor';
import { FourOhFourModule } from '@shared/views/four-oh-four/four-oh-four.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { environment, SecondaryAADScopes, AllAADScopes } from '../environments/environment';

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
import { GravityGiftingState } from '@shared/pages/gifting/gravity/state/gravity-gifting.state';
import { SunriseGiftingState } from '@shared/pages/gifting/sunrise/state/sunrise-gifting.state';
import { ApolloGiftingState } from '@shared/pages/gifting/apollo/state/apollo-gifting.state';
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
import { HubsModule } from '@shared/hubs/hubs.module';
import { SteelheadGiftingState } from '@shared/pages/gifting/steelhead/state/steelhead-gifting.state';
import { SteelheadGiftHistoryState } from '@navbar-app/pages/gift-history/steelhead/state/steelhead-gift-history.state';
import { USER_GUARD_PROVIDERS } from './route-guards/user-role.guards';
import { WoodstockGiftingState } from '@shared/pages/gifting/woodstock/state/woodstock-gifting.state';
import { WoodstockGiftHistoryState } from '@navbar-app/pages/gift-history/woodstock/state/woodstock-gift-history.state';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { LuxonModule } from 'luxon-angular';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { EndpointSelectionInterceptor } from '@interceptors/endpoint-selection.interceptor';
import { StagingRewriteInterceptor } from '@interceptors/staging-rewrite.interceptor';

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

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
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
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [SecondaryAADScopes.UserRead]); // Prod environment. Uncomment to use.
  // protectedResourceMap.set('https://graph.microsoft-ppe.com/v1.0/me', [ SecondaryAADScopes.UserRead ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: AllAADScopes,
    },
    loginFailedRoute: '/login-failed',
  };
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
    MatSnackBarModule, //App component uses this to display init errors.
    MatLuxonDateModule,
    LuxonModule,
    MatNativeDateModule,
    CenterContentsModule,
    FlexLayoutModule,
    AvailableAppsModule,
    HubsModule,
    NgxsModule.forRoot(
      [
        UserState,
        UserSettingsState,
        TitleMemoryState,
        MasterInventoryListMemoryState,
        LspGroupMemoryState,
        EndpointKeyMemoryState,
        // Gifting page states
        WoodstockGiftingState,
        SteelheadGiftingState,
        GravityGiftingState,
        SunriseGiftingState,
        ApolloGiftingState,
        // Gift History page states
        WoodstockGiftHistoryState,
        SteelheadGiftHistoryState,
        GravityGiftHistoryState,
        SunriseGiftHistoryState,
        ApolloGiftHistoryState,
      ],
      { developmentMode: !environment.production },
    ),
    NgxsStoragePluginModule.forRoot({
      key: [UserSettingsState, UserState],
    }),
    NgxsRouterPluginModule.forRoot(),
    MsalModule,
  ],
  providers: [
    ZafClientService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
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
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    LoggerService,
    { provide: RouteReuseStrategy, useClass: StoreForeverStrategy },
    Clipboard,
    ...fakeApiOrNothing(),
    ...USER_GUARD_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EndpointSelectionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StagingRewriteInterceptor,
      multi: true,
    },
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
      useClass: BigNumberInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EndpointSelectionInterceptor,
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
