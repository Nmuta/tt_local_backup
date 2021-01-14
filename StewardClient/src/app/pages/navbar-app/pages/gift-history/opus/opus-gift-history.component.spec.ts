import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusGiftHistoryComponent } from './opus-gift-history.component';

describe('OpusGiftHistoryComponent', () => {
  let component: OpusGiftHistoryComponent;
  let fixture: ComponentFixture<OpusGiftHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpusGiftHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusGiftHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
