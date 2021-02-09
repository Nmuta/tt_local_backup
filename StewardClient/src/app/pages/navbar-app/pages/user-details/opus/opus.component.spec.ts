import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpusComponent } from './opus.component';

describe('OpusComponent', () => {
  let component: OpusComponent;
  let fixture: ComponentFixture<OpusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
