import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Clipboard } from '@shared/helpers';
import { MatToolbarModule } from '@angular/material';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCopy, faUser } from '@fortawesome/free-solid-svg-icons';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AccessTokenInterceptor } from '@shared/interceptors/access-token.interceptor';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { ErrorComponent } from './error/error.cmpt';

export const protectedResourceMap: [string, string[]][] = [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ];

@NgModule({
    declarations: [
        AppComponent,
        ErrorComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        FontAwesomeModule,
        HttpClientModule,
        NgxsModule.forRoot([UserState]),
        MsalModule.forRoot({
            auth: {
              clientId: '48a8a430-0f6b-4469-940f-1c5c6af1fd88',
              authority: 'https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47/',
              redirectUri: `${environment.clientUrl}/auth?from=signin`
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: false, // set to true for IE 11
            },
          },
          {
            popUp: false,
            consentScopes: [
              'user.read',
              'openid',
              'profile',
              environment.azureAppScope
            ],
            unprotectedResources: [],
            protectedResourceMap,
            extraQueryParameters: {}
          })
    ],
    providers: [
        Clipboard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AccessTokenInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faCopy, faUser);
    }
}
