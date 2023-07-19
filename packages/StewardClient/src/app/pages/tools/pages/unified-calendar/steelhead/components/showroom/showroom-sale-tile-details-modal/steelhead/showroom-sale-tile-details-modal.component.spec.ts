import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { ShowroomSaleTileDetailsModalComponent } from './showroom-sale-tile-details-modal.component';
import faker from '@faker-js/faker';
import { CarSale } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { toDateTime } from '@helpers/luxon';

describe('ShowroomSaleTileDetailsModalComponent', () => {
  let component: ShowroomSaleTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomSaleTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowroomSaleTileDetailsModalComponent],
      imports: [MatDialogModule, PipesModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            startTimeUtc: toDateTime(faker.date.past()),
            endTimeUtc: toDateTime(faker.date.future()),
          } as CarSale,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomSaleTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
