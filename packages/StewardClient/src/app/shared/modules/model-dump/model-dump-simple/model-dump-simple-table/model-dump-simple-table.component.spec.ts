import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDumpSimpleTableComponent } from './model-dump-simple-table.component';

describe('ModelDumpSimpleTableComponent', () => {
  let component: ModelDumpSimpleTableComponent;
  let fixture: ComponentFixture<ModelDumpSimpleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelDumpSimpleTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpSimpleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
