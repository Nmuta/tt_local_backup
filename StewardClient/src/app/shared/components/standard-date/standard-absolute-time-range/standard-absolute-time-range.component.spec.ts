import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime } from 'luxon';
import { LuxonModule } from 'luxon-angular';

import { StandardAbsoluteTimeRangeComponent } from './standard-absolute-time-range.component';

describe('StandardAbsoluteTimeRangeComponent', () => {
  let component: StandardAbsoluteTimeRangeComponent;
  let fixture: ComponentFixture<StandardAbsoluteTimeRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardAbsoluteTimeRangeComponent],
      imports: [PipesModule, LuxonModule, StandardCopyModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAbsoluteTimeRangeComponent);
    component = fixture.componentInstance;
    component.startTimeUtc = DateTime.local().minus({ days: 15 });
    component.endTimeUtc = DateTime.local();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
