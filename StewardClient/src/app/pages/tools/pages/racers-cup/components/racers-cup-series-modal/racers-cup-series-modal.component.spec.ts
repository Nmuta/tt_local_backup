import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faker } from '@interceptors/fake-api/utility';
import { of } from 'rxjs';
import {
  RacersCupSeriesModalComponent,
  RacersCupSeriesModalData,
} from './racers-cup-series-modal.component';

describe('RacersCupSeriesModalComponent', () => {
  let component: RacersCupSeriesModalComponent;
  let fixture: ComponentFixture<RacersCupSeriesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RacersCupSeriesModalComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { name: faker.random.word(), events: [] } as RacersCupSeriesModalData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacersCupSeriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
