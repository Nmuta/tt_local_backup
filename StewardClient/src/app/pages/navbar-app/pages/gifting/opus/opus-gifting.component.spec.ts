import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusGiftingComponent } from './opus-gifting.component';

describe('OpusGiftingComponent', () => {
  let component: OpusGiftingComponent;
  let fixture: ComponentFixture<OpusGiftingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusGiftingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusGiftingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
