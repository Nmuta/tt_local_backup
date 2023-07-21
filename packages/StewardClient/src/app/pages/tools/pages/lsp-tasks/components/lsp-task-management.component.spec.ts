import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import {
  LspTaskManagementComponent,
  LspTaskManagementContract,
} from './lsp-task-management.component';
import { GameTitle } from '@models/enums';
import { of } from 'rxjs';
import { LspTask } from '@models/lsp-task';
import { createMockMsalServices } from '@mocks/msal.service.mock';
import { createMockLoggerService } from '@services/logger/logger.service.mock';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('LspTaskManagementComponent', () => {
  let component: LspTaskManagementComponent;
  let fixture: ComponentFixture<LspTaskManagementComponent>;

  const mockContract: LspTaskManagementContract = {
    gameTitle: GameTitle.FH5,
    getLspTasks$: () => {
      return of(undefined);
    },
    updateLspTask$: (_task: LspTask) => {
      return of(undefined);
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [LspTaskManagementComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...createMockMsalServices(), createMockLoggerService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LspTaskManagementComponent);
    component = fixture.debugElement.componentInstance;
    component.service = mockContract;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    describe('When contract is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
