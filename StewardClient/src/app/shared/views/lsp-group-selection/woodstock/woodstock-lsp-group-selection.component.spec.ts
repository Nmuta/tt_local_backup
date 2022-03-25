import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import { GameTitleCodeName } from '@models/enums';
import { WoodstockLspGroupSelectionComponent } from './woodstock-lsp-group-selection.component';
import { LspGroupMemoryState } from '@shared/state/lsp-group-memory/lsp-group-memory.state';

describe('WoodstockLspGroupSelectionComponent', () => {
  let fixture: ComponentFixture<WoodstockLspGroupSelectionComponent>;
  let component: WoodstockLspGroupSelectionComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [WoodstockLspGroupSelectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(WoodstockLspGroupSelectionComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: dispatchLspGroupStoreAction', () => {
    beforeEach(() => {
      mockStore.dispatch = jasmine.createSpy('dispatch');
    });

    it('should dispatch GetLspGroups', () => {
      component.dispatchLspGroupStoreAction();
      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetLspGroups(GameTitleCodeName.FH5));
    });
  });

  describe('Method: lspGroupSelector$', () => {
    beforeEach(() => {
      mockStore.select = jasmine.createSpy('select');
    });

    it('should select woodstock lsp groups from memory', () => {
      component.lspGroupSelector$();
      expect(mockStore.select).toHaveBeenCalledWith(LspGroupMemoryState.WoodstockLspGroups);
    });
  });
});
