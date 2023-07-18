import { Injectable } from '@angular/core';
import { LspTask } from '@models/lsp-task';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/task endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadTaskService {
  public readonly basePath: string = 'title/steelhead/task';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Tasks. */
  public getTasks$(): Observable<LspTask[]> {
    return this.api.getRequest$<LspTask[]>(`${this.basePath}`);
  }

  /** Gets the Tasks. */
  public updateTask$(task: LspTask): Observable<void> {
    return this.api.putRequest$<void>(`${this.basePath}`, task);
  }
}
