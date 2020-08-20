// General
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

// Models

// Services
import { ApiService } from '@shared/services/api';
import { catchError } from 'rxjs/operators';
import { UserModel } from '@shared/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private apiService: ApiService) {}

    public getUserProfile(): Observable<UserModel> {
        return this.apiService.getRequest<any>('me');
    }
}
