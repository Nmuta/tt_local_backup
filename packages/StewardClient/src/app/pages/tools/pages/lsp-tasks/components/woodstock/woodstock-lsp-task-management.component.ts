import { Component } from '@angular/core';
import { WoodstockLspTaskService } from '@services/api-v2/woodstock/lsp-tasks/woodstock-lsp-tasks.service';
import { BaseComponent } from '@components/base-component/base.component';

/**
 *  Woodstock lsp task management component.
 */
@Component({
  templateUrl: './woodstock-lsp-task-management.component.html',
})
export class WoodstockLspTaskManagementComponent extends BaseComponent {
  constructor(public service: WoodstockLspTaskService) {
    super();
  }
}
