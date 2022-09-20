import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';

import { ToggleListEzComponent } from './toggle-list-ez.component';

describe('ToggleListEzComponent', () => {
  let component: ToggleListEzComponent;
  let fixture: ComponentFixture<ToggleListEzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleListEzComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleListEzComponent);
    component = fixture.componentInstance;
    component.contract = {
      initialModel: {},
      order: [],
      title: 'test',
      submitModel$: () => NEVER,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
