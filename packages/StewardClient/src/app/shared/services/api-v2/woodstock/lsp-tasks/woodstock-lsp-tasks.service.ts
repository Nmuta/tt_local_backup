import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LspTask } from '@models/lsp-task';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

/** The /v2/title/woodstock/task endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockLspTaskService {
  public readonly basePath: string = 'title/woodstock/lsp-task';
  public gameTitle: GameTitle.FH5;

  constructor(private readonly api: ApiV2Service) {}

  /** Gets the Lsp Tasks. */
  public getLspTasks$(): Observable<LspTask[]> {
    return this.api.getRequest$<LspTask[]>(`${this.basePath}`);
  }

  /** Updates a single Lsp task. */
  public updateLspTask$(task: LspTask): Observable<void> {
    return this.api.postRequest$<void>(`${this.basePath}/update-single`, task);
  }
}
