import { Injectable } from '@angular/core';
import { UserModel } from '@models/user.model';
import { ApiService } from '@shared/services/api';
import { Observable } from 'rxjs';

/** Defines the User Service. */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  public basePath: string = 'v1';

  constructor(private apiService: ApiService) {}

  /** Sends request to get the user profile. */
  public getUserProfile(): Observable<UserModel> {
    return this.apiService.getRequest<UserModel>(`${this.basePath}/me`);
  }
}
