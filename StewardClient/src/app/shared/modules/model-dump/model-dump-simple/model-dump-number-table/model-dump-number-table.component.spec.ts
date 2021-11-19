import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpNumberTableComponent } from './model-dump-number-table.component';

describe('ModelDumpNumberTableComponent', () => {
  let component: ModelDumpNumberTableComponent;
  let fixture: ComponentFixture<ModelDumpNumberTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelDumpNumberTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpNumberTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
