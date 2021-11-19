import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ExtractedModel } from '../helpers';
import { MODEL_DUMP_PROCESSED_MODEL$ } from '../model-dump.component';

import { ModelDumpXuidsComponent } from './model-dump-xuids.component';

describe('ModelDumpXuidsComponent', () => {
  let component: ModelDumpXuidsComponent;
  let fixture: ComponentFixture<ModelDumpXuidsComponent>;
  const processedModel$ = new BehaviorSubject<ExtractedModel>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelDumpXuidsComponent],
      providers: [
        {
          provide: MODEL_DUMP_PROCESSED_MODEL$,
          useValue: processedModel$,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDumpXuidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
