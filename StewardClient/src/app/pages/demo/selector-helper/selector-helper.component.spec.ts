import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';
import { NgPipesModule } from 'ngx-pipes';

import { SelectorHelperComponent } from './selector-helper.component';

describe('SelectorHelperComponent', () => {
  let component: SelectorHelperComponent;
  let fixture: ComponentFixture<SelectorHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorHelperComponent],
      imports: [NgPipesModule, PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
