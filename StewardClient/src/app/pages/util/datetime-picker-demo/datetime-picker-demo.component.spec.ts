import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PipesModule } from '@shared/pipes/pipes.module';

import { DateTimePickerDemoComponent } from './datetime-picker-demo.component';

describe('IconsComponent', () => {
  let component: DateTimePickerDemoComponent;
  let fixture: ComponentFixture<DateTimePickerDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateTimePickerDemoComponent],
      imports: [PipesModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePickerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
