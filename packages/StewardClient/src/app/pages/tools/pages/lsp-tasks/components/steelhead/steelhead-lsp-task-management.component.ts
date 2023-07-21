import { Component } from '@angular/core';
import { LspTaskManagementContract } from '../lsp-task-management.component';
import { SteelheadLspTaskService } from '@services/api-v2/steelhead/lsp-tasks/steelhead-lsp-tasks.service';
import { GameTitle } from '@models/enums';
import { LspTask } from '@models/lsp-task';
import { Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Steelhead task management component.
 */
@Component({
  templateUrl: './steelhead-lsp-task-management.component.html',
})
export class SteelheadLspTaskManagementComponent extends BaseComponent {
  public service: LspTaskManagementContract;

  constructor(taskService: SteelheadLspTaskService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM8,
      getLspTasks$(): Observable<LspTask[]> {
        return taskService.getLspTasks$();
      },
      updateLspTask$(task: LspTask): Observable<void> {
        return taskService.updateLspTask$(task);
      },
    };
  }
}
