import { Component } from '@angular/core';
import { SteelheadLspTaskService } from '@services/api-v2/steelhead/lsp-tasks/steelhead-lsp-tasks.service';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Steelhead task management component.
 */
@Component({
  templateUrl: './steelhead-lsp-task-management.component.html',
})
export class SteelheadLspTaskManagementComponent extends BaseComponent {
  constructor(public service: SteelheadLspTaskService) {
    super();
  }
}
