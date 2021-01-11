import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LspGroupSelectionBaseComponent } from './lsp-group-selection.base.component';

describe('LspGroupSelectionBaseComponent', () => {
  let fixture: ComponentFixture<LspGroupSelectionBaseComponent>;
  let component: LspGroupSelectionBaseComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [LspGroupSelectionBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        LspGroupSelectionBaseComponent as Type<LspGroupSelectionBaseComponent>,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
