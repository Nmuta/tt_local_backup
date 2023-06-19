import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameTitle } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { AcLogReaderResponse } from '@services/api-v2/steelhead/ac-log-reader/steelhead-ac-log-reader.service';
import { createMockSunriseService } from '@services/sunrise/sunrise.service.mock';
import { Observable, of } from 'rxjs';
import {
  AcLogReaderBaseComponent,
  AcLogReaderServiceContract,
} from './ac-log-reader.base.component';

const mockServiceContract: AcLogReaderServiceContract = {
  gameTitle: GameTitle.FM8,
  processGameLog$(_: string): Observable<AcLogReaderResponse> {
    return of();
  },
};

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
    component.service = mockServiceContract;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('When contract is null', () => {
      beforeEach(() => {
        component.service = null;
      });

      it('should throw error', () => {
        try {
          component.ngOnChanges();

          expect(false).toBeTruthy();
        } catch (e) {
          expect(true).toBeTruthy();
          expect(e.message).toEqual(
            'Service Contract could not be found for AC Log Reader component.',
          );
        }
      });
    });

    describe('When contract is provided', () => {
      // Provided by default in the test component
      it('should not throw error', () => {
        try {
          fixture.detectChanges();

          expect(true).toBeTruthy();
        } catch (e) {
          expect(e).toEqual(null);
          expect(false).toBeTruthy();
        }
      });
    });
  });
});
