import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { LspTask, TaskPeriodType, TaskState } from '@models/lsp-task';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { flatten } from 'lodash';
import { DateTime } from 'luxon';
import { Observable, takeUntil } from 'rxjs';

/** Interface used to track action monitor, form group, and edit state across rows. */
export interface FormGroupTaskEntry {
  formGroup: FormGroup;
  edit?: boolean;
  postMonitor: ActionMonitor;
  task: LspTask;
}

/** Group notification management contract. */
export interface TaskManagementContract {
  /** Get game title. */
  gameTitle: GameTitle;
  /** Get tasks. */
  getTasks$(): Observable<LspTask[]>;
  /** Update a task. */
  updateTask$(task: LspTask): Observable<void>;
}

/** Displays the tasks. */
@Component({
  selector: 'task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss'],
})
export class TaskManagementComponent extends BaseComponent implements OnInit {
  /** The task service. */
  @Input() public service: TaskManagementContract;

  public getMonitor: ActionMonitor = new ActionMonitor('GET');
  public allMonitors = [this.getMonitor];
  public rawTasks: LspTask[];
  public tasks = new MatTableDataSource<FormGroupTaskEntry>();
  public columnsToDisplay = ['task-info', 'execution-info', 'actions'];
  public taskPeriodTypes: TaskPeriodType[] = [
    TaskPeriodType.Deterministic,
    TaskPeriodType.NonDeterministic,
  ];
  public minDate: DateTime = DateTime.utc();
  public taskStateEnum = TaskState;
  public readonly permAttribute = PermAttributeName.UpdateTask;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service provided for TaskComponent');
    }

    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getTasks$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(tasks => {
        this.rawTasks = tasks;
        this.tasks.data = tasks.map(entry => {
          return this.prepareTasks(entry);
        });
        this.allMonitors = flatten(this.tasks.data.map(v => [v.postMonitor])).concat(
          this.getMonitor,
        );
      });
  }

  /** Update notification selected */
  public updateNotificationEntry(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.task;
    updatedTask.nextExecutionUtc = entry.formGroup.controls.nextExecutionUtc.value;
    updatedTask.periodInSeconds = entry.formGroup.controls.periodInSeconds.value; //is a bignumber?
    updatedTask.periodType = entry.formGroup.controls.periodType.value;

    this.updateTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public runNow(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.task;
    updatedTask.nextExecutionUtc = DateTime.utc();

    this.updateTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public changeState(entry: FormGroupTaskEntry): void {
    const updatedTask: LspTask = entry.task;
    const newState =
      entry.task.state == TaskState.Disabled ? TaskState.Pending : TaskState.Disabled;
    updatedTask.state = newState;

    this.updateTask(updatedTask, entry);
  }

  /** Puts entry in editable state. */
  public editEntry(entry: FormGroupTaskEntry): void {
    entry.edit = true;
  }

  /** Reverts an entry from edit state. */
  public revertEntryEdit(entry: FormGroupTaskEntry): void {
    entry.edit = false;
    const rawEntry = this.rawTasks.find(v => v.id == entry.task.id);
    entry.formGroup.controls.nextExecutionUtc.setValue(rawEntry.nextExecutionUtc);
    entry.formGroup.controls.periodInSeconds.setValue(rawEntry.periodInSeconds);
    entry.formGroup.controls.periodType.setValue(rawEntry.periodType);
    entry.postMonitor = new ActionMonitor('Edit Task');
  }

  private prepareTasks(lspTask: LspTask): FormGroupTaskEntry {
    const formControls = {
      nextExecutionUtc: new FormControl(lspTask.nextExecutionUtc, [Validators.required]),
      periodInSeconds: new FormControl(lspTask.periodInSeconds, [Validators.required]),
      periodType: new FormControl(lspTask.periodType, [Validators.required]),
    };
    const newControls = <FormGroupTaskEntry>{
      formGroup: new FormGroup(formControls),
      formControls: formControls,
      postMonitor: new ActionMonitor('Edit Task'),
      task: lspTask,
    };

    return newControls;
  }

  private updateTask(task: LspTask, entry: FormGroupTaskEntry): void {
    entry.postMonitor = entry.postMonitor.repeat();
    this.service
      .updateTask$(task)
      .pipe(entry.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => this.replaceRawEntry(entry));
  }

  private replaceRawEntry(entry: FormGroupTaskEntry): void {
    entry.edit = false;
    const rawEntry = this.rawTasks.find(v => v.id == entry.task.id);

    rawEntry.nextExecutionUtc = entry.formGroup.controls.nextExecutionUtc.value;
    rawEntry.periodInSeconds = entry.formGroup.controls.periodInSeconds.value;
    rawEntry.periodType = entry.formGroup.controls.periodType.value;

    //const index = this.tasks.data.indexOf(entry);
    //this.rawTasks.splice(index, 1, newEntry);
    this.tasks._updateChangeSubscription();
  }
}
