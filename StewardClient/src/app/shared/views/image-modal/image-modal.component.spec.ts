import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faker } from '@interceptors/fake-api/utility';
import { ImageModalComponent, ImageModalData } from './image-modal.component';

describe('ImageModalComponent', () => {
  const model: ImageModalData = {
    title: faker.random.word(),
    url: faker.random.word(),
  };

  let fixture: ComponentFixture<ImageModalComponent>;
  let component: ImageModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageModalComponent],
      imports: [MatButtonModule, MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: model,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: close', () => {
    it('Should call mockMatDialogRef.close', () => {
      component.close();

      expect(mockMatDialogRef.close).toHaveBeenCalled();
    });
  });
});
