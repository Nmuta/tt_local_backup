import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import faker from '@faker-js/faker';
import { DivisionFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomDivisionFeaturedTileDetailsModalComponent } from './showroom-division-featured-tile-details-modal.component';

describe('ShowroomDivisionFeaturedTileDetailsModalComponent', () => {
  let component: ShowroomDivisionFeaturedTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomDivisionFeaturedTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowroomDivisionFeaturedTileDetailsModalComponent],
      imports: [MatDialogModule, PipesModule, HttpClientTestingModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: faker.datatype.string(),
            description: faker.datatype.string(),
            startTimeUtc: faker.datatype.datetime().toISOString(),
            endTimeUtc: faker.datatype.datetime().toISOString(),
            divisionId: faker.datatype.number(),
            divisionName: faker.datatype.string(),
          } as DivisionFeaturedShowcase,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomDivisionFeaturedTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
