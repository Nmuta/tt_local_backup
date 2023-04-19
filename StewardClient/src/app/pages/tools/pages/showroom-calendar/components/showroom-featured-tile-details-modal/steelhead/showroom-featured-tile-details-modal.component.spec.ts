import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { ShowroomFeaturedTileDetailsModalComponent } from './showroom-featured-tile-details-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import faker from '@faker-js/faker';
import { CarFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';

describe('ShowroomFeaturedTileDetailsModalComponent', () => {
  let component: ShowroomFeaturedTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomFeaturedTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowroomFeaturedTileDetailsModalComponent],
      imports: [MatDialogModule, PipesModule, HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            startTime: faker.datatype.datetime().toISOString(),
            endTime: faker.datatype.datetime().toISOString(),
            car: {
              carId: faker.datatype.number(),
              baseCost: faker.datatype.number(),
              mediaName: faker.datatype.string(),
              modelShort: faker.datatype.string(),
            },
          } as CarFeaturedShowcase,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomFeaturedTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
