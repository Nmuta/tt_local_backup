import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanOptionsComponent } from './ban-options.component';

describe('BanOptionsComponent', () => {
  let component: BanOptionsComponent;
  let fixture: ComponentFixture<BanOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BanOptionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
