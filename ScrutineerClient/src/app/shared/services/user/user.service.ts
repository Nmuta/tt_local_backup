// General
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '@shared/models/user.model';
import { ApiService } from '@shared/services/api';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Models

// Services

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private apiService: ApiService) {}

    public getUserProfile(): Observable<UserModel> {
        return this.apiService.getRequest<any>('me');
    }
}
