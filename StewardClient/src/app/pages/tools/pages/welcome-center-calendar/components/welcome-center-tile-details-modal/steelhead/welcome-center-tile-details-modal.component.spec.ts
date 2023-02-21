import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import faker from '@faker-js/faker';
import { PipesModule } from '@shared/pipes/pipes.module';
import { of } from 'rxjs';
import {
  WelcomeCenterTileDetailsModalComponent,
  WelcomeCenterTileDetailsModalData,
} from './welcome-center-tile-details-modal.component';

describe('WelcomeCenterTileDetailsModalComponent', () => {
  let component: WelcomeCenterTileDetailsModalComponent;
  let fixture: ComponentFixture<WelcomeCenterTileDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeCenterTileDetailsModalComponent],
      imports: [MatDialogModule, PipesModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            columns: [
              {
                name: faker.random.word(),
                events: [],
                tileCount: 0,
              },
            ],
          } as WelcomeCenterTileDetailsModalData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeCenterTileDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
