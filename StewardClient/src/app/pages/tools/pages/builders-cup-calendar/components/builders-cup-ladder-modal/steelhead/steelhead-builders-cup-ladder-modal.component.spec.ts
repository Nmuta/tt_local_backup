import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import faker from '@faker-js/faker';
import { of } from 'rxjs';
import {
  SteelheadBuildersCupLadderModalComponent,
  SteelheadBuildersCupLadderModalData,
} from './steelhead-builders-cup-ladder-modal.component';

describe('SteelheadBuildersCupLadderModalComponent', () => {
  let component: SteelheadBuildersCupLadderModalComponent;
  let fixture: ComponentFixture<SteelheadBuildersCupLadderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SteelheadBuildersCupLadderModalComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            name: faker.random.word(),
            events: [],
          } as SteelheadBuildersCupLadderModalData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SteelheadBuildersCupLadderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
