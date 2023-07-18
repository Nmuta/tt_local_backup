import { Component } from '@angular/core';
import { TaskManagementContract } from '../task-management.component';
import { WoodstockTaskService } from '@services/api-v2/woodstock/task/woodstock-task.service';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { LspTask } from '@models/lsp-task';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Woodstock task management component.
 */
@Component({
  templateUrl: './woodstock-task-management.component.html',
})
export class WoodstockTaskManagementComponent extends BaseComponent {
  public service: TaskManagementContract;

  constructor(taskService: WoodstockTaskService) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      getTasks$(): Observable<LspTask[]> {
        return taskService.getTasks$();
      },
      updateTask$(task: LspTask): Observable<void> {
        return taskService.updateTask$(task);
      },
    };
  }
}
