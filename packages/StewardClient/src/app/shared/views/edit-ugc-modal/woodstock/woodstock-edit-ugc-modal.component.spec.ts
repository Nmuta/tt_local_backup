import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WoodstockEditUgcModalComponent } from './woodstock-edit-ugc-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { PlayerUgcItem, fakePlayerUgcItem } from '@models/player-ugc-item';

describe('WoodstockEditUgcModalComponent', () => {
  const model: PlayerUgcItem = fakePlayerUgcItem();

  let fixture: ComponentFixture<WoodstockEditUgcModalComponent>;
  let component: WoodstockEditUgcModalComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockMatDialogRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WoodstockEditUgcModalComponent],
      imports: [HttpClientTestingModule, NgxsModule.forRoot(), MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: () => null, beforeClosed: () => of() },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: model,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodstockEditUgcModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    mockMatDialogRef = TestBed.inject(MatDialogRef);
    mockMatDialogRef.close = jasmine.createSpy('close');
    mockMatDialogRef.beforeClosed = jasmine.createSpy('beforeClosed').and.returnValue(of());
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
