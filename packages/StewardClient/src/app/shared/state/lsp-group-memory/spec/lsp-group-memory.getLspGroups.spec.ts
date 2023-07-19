import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { LspGroupMemoryState } from '../lsp-group-memory.state';
import { GetLspGroups } from '../lsp-group-memory.actions';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createMockSunriseService, SunriseService } from '@services/sunrise';
import { createMockApolloService } from '@services/apollo';
import { EMPTY } from 'rxjs';

describe('State: LspGroupMemoryState', () => {
  let service: LspGroupMemoryState;
  let store: Store;
  let mockSunriseService: SunriseService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([LspGroupMemoryState])],
      providers: [createMockSunriseService(), createMockApolloService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(LspGroupMemoryState);
    store = TestBed.inject(Store);
    mockSunriseService = TestBed.inject(SunriseService);

    mockSunriseService.getLspGroups$ = jasmine.createSpy('getLspGroups$').and.returnValue(
      of([
        { id: 0, name: 'test-1' },
        { id: 1, name: 'test-2' },
      ]),
    );

    store.reset({
      lspGroupMemory: {
        Sunrise: [],
        Apollo: [],
      },
    });
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[GetLspGroups] Action', () => {
    let action;

    describe('When valid title is provided to the action', () => {
      const title: GameTitleCodeName = GameTitleCodeName.FH4;
      beforeEach(() => {
        action = new GetLspGroups(title);
      });

      describe('If store does not have title lsp groups set', () => {
        beforeEach(() => {
          store.reset({
            lspGroupMemory: {
              Sunrise: [],
              Apollo: [],
            },
          });
        });

        it('should call title service for lsp groups', () => {
          store.dispatch(action);

          expect(mockSunriseService.getLspGroups$).toHaveBeenCalled();
        });
      });
      describe('If store has title lsp groups set', () => {
        beforeEach(() => {
          store.reset({
            lspGroupMemory: {
              Sunrise: [{ id: 0, name: 'test-1' }],
              Apollo: [{ id: 0, name: 'test-1' }],
            },
          });
        });

        it('should not call title service for lsp groups', () => {
          store.dispatch(action);

          expect(mockSunriseService.getLspGroups$).not.toHaveBeenCalled();
        });
      });
    });

    describe('When valid title is provided to the action', () => {
      const badTitle: GameTitleCodeName = GameTitleCodeName.FH3;
      beforeEach(() => {
        action = new GetLspGroups(badTitle);
      });

      it('should throw error', () => {
        store
          .dispatch(action)
          .pipe(
            catchError(error => {
              expect(error).toEqual('Opus is not currently setup to handle LSP groups.');
              return EMPTY;
            }),
            tap(() => {
              expect(false).toBeTruthy();
            }),
          )
          .subscribe();
      });
    });
  });
});
