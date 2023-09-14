import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StewardAppBaseComponent } from './steward-app.base.component';
import { createMockLoggerService } from '@services/logger/logger.service.mock';

describe('StewardAppBaseComponent', () => {
  let component: StewardAppBaseComponent;
  let fixture: ComponentFixture<StewardAppBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [StewardAppBaseComponent],
      providers: [createMockLoggerService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StewardAppBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
