import { Component } from '@angular/core';
import { TaskManagementContract } from '../task-management.component';
import { SteelheadTaskService } from '@services/api-v2/steelhead/task/steelhead-task.service';
import { GameTitle } from '@models/enums';
import { LspTask } from '@models/lsp-task';
import { Observable } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Steelhead task management component.
 */
@Component({
  templateUrl: './steelhead-task-management.component.html',
})
export class SteelheadTaskManagementComponent extends BaseComponent {
  public service: TaskManagementContract;

  constructor(taskService: SteelheadTaskService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM8,
      getTasks$(): Observable<LspTask[]> {
        return taskService.getTasks$();
      },
      updateTask$(task: LspTask): Observable<void> {
        return taskService.updateTask$(task);
      },
    };
  }
}
