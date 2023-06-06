import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { AcLogReaderBaseComponent } from './ac-log-reader.base.component';

describe('AcLogReaderBaseComponent', () => {
  let component: AcLogReaderBaseComponent;
  let fixture: ComponentFixture<AcLogReaderBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), NgxsModule.forRoot([])],
      declarations: [AcLogReaderBaseComponent],
      providers: [createMockSunriseService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcLogReaderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
