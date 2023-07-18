import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TaskManagementComponent, TaskManagementContract } from './task-management.component';
import { GameTitle } from '@models/enums';
import { of } from 'rxjs';
import { LspTask } from '@models/lsp-task';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('TaskManagementComponent', () => {
  let component: TaskManagementComponent;
  let fixture: ComponentFixture<TaskManagementComponent>;

  const mockService: TaskManagementContract = {
    gameTitle: GameTitle.FH5,
    getTasks$: () => {
      return of(undefined);
    },
    updateTask$: (_task: LspTask) => {
      return of(undefined);
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [TaskManagementComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManagementComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockService;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
