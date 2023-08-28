import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BountyComponent } from './bounty.component';

describe('BountyComponent', () => {
  let component: BountyComponent;
  let fixture: ComponentFixture<BountyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BountyComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
