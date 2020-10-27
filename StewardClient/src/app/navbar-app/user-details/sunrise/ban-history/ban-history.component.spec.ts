import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanHistoryComponent } from './ban-history.component';

describe('BanHistoryComponent', () => {
  let component: BanHistoryComponent;
  let fixture: ComponentFixture<BanHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
