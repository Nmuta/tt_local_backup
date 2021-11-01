import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenUgcTableComponent } from './hidden-ugc-table.component';

describe('HiddenUgcTableComponent', () => {
  let component: HiddenUgcTableComponent;
  let fixture: ComponentFixture<HiddenUgcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiddenUgcTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenUgcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
