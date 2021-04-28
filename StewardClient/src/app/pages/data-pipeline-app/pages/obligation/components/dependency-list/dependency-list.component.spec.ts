import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyListComponent } from './dependency-list.component';

describe('DependencyListComponent', () => {
  let component: DependencyListComponent;
  let fixture: ComponentFixture<DependencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DependencyListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
