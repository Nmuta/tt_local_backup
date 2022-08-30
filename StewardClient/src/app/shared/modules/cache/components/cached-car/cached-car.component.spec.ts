import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CachedCarComponent } from './cached-car.component';

describe('CachedCarComponent', () => {
  let component: CachedCarComponent;
  let fixture: ComponentFixture<CachedCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CachedCarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CachedCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
