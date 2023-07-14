import { Injectable } from '@angular/core';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';
import { ShareCodeOutputModel } from './find-models';

/** The /v2/all/ugc/find endpoints. */
@Injectable({
  providedIn: 'root',
})
export class MultipleUgcFindService {
  private basePath: string = 'title/multi/ugc/find';
  constructor(private readonly api: ApiV2Service) {}

  /** Finds out which title/type a UGC sharecode is for. */
  public getByShareCodeOrId$(shareCodeOrId: string): Observable<ShareCodeOutputModel> {
    return this.api.getRequest$(`${this.basePath}/${shareCodeOrId}`);
  }
}
