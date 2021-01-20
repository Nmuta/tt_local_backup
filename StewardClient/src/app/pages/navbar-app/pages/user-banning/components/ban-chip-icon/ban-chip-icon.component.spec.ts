import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanChipIconComponent } from './ban-chip-icon.component';

describe('BanChipIconComponent', () => {
  let component: BanChipIconComponent;
  let fixture: ComponentFixture<BanChipIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanChipIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanChipIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
