import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import faker from '@faker-js/faker';
import { CarFeaturedShowcase } from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomCarFeaturedTileDetailsModalComponent } from './showroom-car-featured-tile-details-modal.component';

describe('ShowroomCarFeaturedTileDetailsModalComponent', () => {
  let component: ShowroomCarFeaturedTileDetailsModalComponent;
  let fixture: ComponentFixture<ShowroomCarFeaturedTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowroomCarFeaturedTileDetailsModalComponent],
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
            startTime: faker.datatype.datetime().toISOString(),
            endTime: faker.datatype.datetime().toISOString(),
            carId: faker.datatype.number(),
            baseCost: faker.datatype.number(),
            mediaName: faker.datatype.string(),
            modelShort: faker.datatype.string(),
            salePercentOff: faker.datatype.number(),
            salePrice: faker.datatype.number(),
            vipSalePercentOff: faker.datatype.number(),
            vipSalePrice: faker.datatype.number(),
          } as CarFeaturedShowcase,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomCarFeaturedTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
