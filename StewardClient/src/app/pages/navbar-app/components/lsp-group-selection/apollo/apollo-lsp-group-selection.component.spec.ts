import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloLspGroupSelectionComponent } from './apollo-lsp-group-selection.component';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import { GameTitleCodeName } from '@models/enums';

describe('ApolloLspGroupSelectionComponent', () => {
  let fixture: ComponentFixture<ApolloLspGroupSelectionComponent>;
  let component: ApolloLspGroupSelectionComponent;

  let mockStore: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [ApolloLspGroupSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      const injector = getTestBed();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockStore = injector.inject(Store);

      fixture = TestBed.createComponent(ApolloLspGroupSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: dispatchLspGroupStoreAction', () => {
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch');
    });

    it('should return correct model', () => {
      component.dispatchLspGroupStoreAction();
      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetLspGroups(GameTitleCodeName.FM7));
    });
  });
});
