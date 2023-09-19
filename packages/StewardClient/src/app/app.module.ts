import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Provider } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
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

import { environment, SecondaryAADScopes, AllAADScopes } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ErrorComponent } from './pages/error/error.component';
import { SidebarsModule } from './sidebars/sidebars.module';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ZafClientService } from '@services/zendesk/zaf-client.service';
import { UtcInterceptor } from '@interceptors/luxon.interceptor';

// States
import { UserState } from '@shared/state/user/user.state';
import { UserSettingsState } from '@shared/state/user-settings/user-settings.state';
import { SunriseGiftingState } from '@tools-app/pages/gifting/sunrise/state/sunrise-gifting.state';
import { ApolloGiftingState } from '@tools-app/pages/gifting/apollo/state/apollo-gifting.state';
import { TitleMemoryState } from '@shared/state/title-memory/title-memory.state';
import { MatNativeDateModule } from '@angular/material/core';
import { LspGroupMemoryState } from '@shared/state/lsp-group-memory/lsp-group-memory.state';
import { SunriseGiftHistoryState } from '@tools-app/pages/gift-history/sunrise/state/sunrise-gift-history.state';
import { ApolloGiftHistoryState } from '@tools-app/pages/gift-history/apollo/state/apollo-gift-history.state';
import { MasterInventoryListMemoryState } from '@shared/state/master-inventory-list-memory/master-inventory-list-memory.state';
import { AvailableAppsModule } from '@shared/views/available-apps/available-apps.module';
import { StoreForeverStrategy } from '@helpers/route-reuse-strategy/store-forever-strategy';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { HubsModule } from '@shared/hubs/hubs.module';
import { SteelheadGiftingState } from '@tools-app/pages/gifting/steelhead/state/steelhead-gifting.state';
import { SteelheadGiftHistoryState } from '@tools-app/pages/gift-history/steelhead/state/steelhead-gift-history.state';
import { WoodstockGiftingState } from '@tools-app/pages/gifting/woodstock/state/woodstock-gifting.state';
import { WoodstockGiftHistoryState } from '@tools-app/pages/gift-history/woodstock/state/woodstock-gift-history.state';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { LuxonModule } from 'luxon-angular';
import { EndpointKeyMemoryState } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import { EndpointSelectionInterceptor } from '@interceptors/endpoint-selection.interceptor';
import { StagingRewriteInterceptor } from '@interceptors/staging-rewrite.interceptor';
import { ToolsAvailabilityInterceptor } from '@interceptors/tools-availability.interceptor';
import { ToolsAvailabilityModalModule } from '@views/tools-availability-modal/tools-availability-modal.module';
import { ThemeModule } from '@shared/modules/theme/theme.module';
import { ChangelogState } from '@shared/state/changelog/changelog.state';
import { UserSettingsService } from '@shared/state/user-settings/user-settings.service';
import { RouteMemoryState } from '@shared/state/route-memory/route-memory.state';
import { NavModule } from '@shared/modules/nav/nav.module';
import { TourMatMenuModule, TourService } from 'ngx-ui-tour-md-menu';
import { TourState } from '@shared/state/tours/tours.state';
import { RedirectionLandingComponent } from './pages/redirection-landing/redirection-landing.component';
import { TitleMemoryRedirectLandingComponent } from './route-guards/title-memory-redirect-landing/title-memory-redirect-landing.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TourStepComponent } from './shared/components/tour-step/tour-step.component';
import { MatIconModule } from '@angular/material/icon';

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
      redirectUri: `${window.origin}/auth/aad-login`,
      postLogoutRedirectUri: `${window.origin}/auth/aad-logout`,
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
  declarations: [
    AppComponent,
    ErrorComponent,
    RedirectionLandingComponent,
    TitleMemoryRedirectLandingComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MarkdownModule.forRoot(),
    RouterModule,
    ThemeModule,
    NavModule,
    AppRoutingModule,
    SidebarsModule,
    FontAwesomeModule,
    HttpClientModule,
    FourOhFourModule,
    MatCardModule,
    MatIconModule,
    TourStepComponent,
    MatSnackBarModule, // App component uses this to display init errors.
    ToolsAvailabilityModalModule, // Used within tools availability interceptor
    MatLuxonDateModule,
    LuxonModule,
    MatNativeDateModule,
    CenterContentsModule,
    AvailableAppsModule,
    HubsModule,
    NgxsModule.forRoot(
      [
        UserState,
        UserSettingsState,
        TitleMemoryState,
        ChangelogState,
        RouteMemoryState,
        MasterInventoryListMemoryState,
        LspGroupMemoryState,
        EndpointKeyMemoryState,
        // Gifting page states
        WoodstockGiftingState,
        SteelheadGiftingState,
        SunriseGiftingState,
        ApolloGiftingState,
        // Gift History page states
        WoodstockGiftHistoryState,
        SteelheadGiftHistoryState,
        SunriseGiftHistoryState,
        ApolloGiftHistoryState,
        // NGX tour state
        TourState,
      ],
      { developmentMode: !environment.production },
    ),
    NgxsStoragePluginModule.forRoot({
      key: [UserSettingsState, UserState, ChangelogState, TourState],
    }),
    NgxsRouterPluginModule.forRoot(),
    MsalModule,
    TourMatMenuModule,
  ],
  providers: [
    TourService,
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
    UserSettingsService,
    { provide: RouteReuseStrategy, useClass: StoreForeverStrategy },
    Clipboard,
    ...fakeApiOrNothing(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ToolsAvailabilityInterceptor,
      multi: true,
    },
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCopy as IconDefinition, faUser as IconDefinition);
  }
}
