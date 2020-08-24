import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState, UserStateModel } from '@shared/state/user/user.state';
import { access } from 'fs';


@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
    @Select(UserState.accessToken) accessToken$: Observable<UserStateModel>;

    constructor(
        protected store: Store,
    ) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let accessToken = this.store.selectSnapshot<any>(UserState.accessToken);
        accessToken = !!accessToken ? accessToken : '';
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return next.handle(request);
    }
}
