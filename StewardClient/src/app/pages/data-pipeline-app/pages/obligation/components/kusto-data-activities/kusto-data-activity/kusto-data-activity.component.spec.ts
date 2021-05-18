import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KustoDataActivityComponent } from './kusto-data-activity.component';

describe('KustoDataActivityComponent', () => {
  let component: KustoDataActivityComponent;
  let fixture: ComponentFixture<KustoDataActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KustoDataActivityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KustoDataActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
