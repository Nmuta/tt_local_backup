import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SteelheadLspGroupSelectionComponent } from './steelhead-lsp-group-selection.component';
import { GetLspGroups } from '@shared/state/lsp-group-memory/lsp-group-memory.actions';
import { GameTitleCodeName } from '@models/enums';
import { LspGroupMemoryState } from '@shared/state/lsp-group-memory/lsp-group-memory.state';

describe('SteelheadLspGroupSelectionComponent', () => {
  let fixture: ComponentFixture<SteelheadLspGroupSelectionComponent>;
  let component: SteelheadLspGroupSelectionComponent;

  let mockStore: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule, NgxsModule.forRoot()],
      declarations: [SteelheadLspGroupSelectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [],
    }).compileComponents();

    const injector = getTestBed();
    mockStore = injector.inject(Store);

    fixture = TestBed.createComponent(SteelheadLspGroupSelectionComponent);
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
      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetLspGroups(GameTitleCodeName.FM8));
    });
  });

  describe('Method: lspGroupSelector', () => {
    beforeEach(() => {
      mockStore.select = jasmine.createSpy('select').and.callThrough();
    });

    it('should select steelhead lsp groups from memory', () => {
      component.lspGroupSelector$();
      expect(mockStore.select).toHaveBeenCalledWith(LspGroupMemoryState.steelheadLspGroups);
    });
  });
});
