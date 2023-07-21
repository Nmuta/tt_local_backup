import { Component } from '@angular/core';
import { LspTaskManagementContract } from '../lsp-task-management.component';
import { WoodstockLspTaskService } from '@services/api-v2/woodstock/lsp-tasks/woodstock-lsp-tasks.service';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { LspTask } from '@models/lsp-task';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Woodstock lsp task management component.
 */
@Component({
  templateUrl: './woodstock-lsp-task-management.component.html',
})
export class WoodstockLspTaskManagementComponent extends BaseComponent {
  public service: LspTaskManagementContract;

  constructor(taskService: WoodstockLspTaskService) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      getLspTasks$(): Observable<LspTask[]> {
        return taskService.getLspTasks$();
      },
      updateLspTask$(task: LspTask): Observable<void> {
        return taskService.updateLspTask$(task);
      },
    };
  }
}
