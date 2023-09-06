import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ToolsAppComponent } from './tools-app.component';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('ToolsAppComponent', () => {
  let component: ToolsAppComponent;
  let fixture: ComponentFixture<ToolsAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ToolsAppComponent],
      providers: [createMockLoggerService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
