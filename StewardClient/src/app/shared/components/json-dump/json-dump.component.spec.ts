import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';

import { JsonDumpComponent } from './json-dump.component';

describe('JsonDumpComponent', () => {
  let component: JsonDumpComponent;
  let fixture: ComponentFixture<JsonDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JsonDumpComponent],
      imports: [PipesModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
