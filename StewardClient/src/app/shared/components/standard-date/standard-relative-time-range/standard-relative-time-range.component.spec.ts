import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime } from 'luxon';
import { LuxonModule } from 'luxon-angular';

import { StandardRelativeTimeRangeComponent } from './standard-relative-time-range.component';

describe('StandardRelativeTimeRangeComponent', () => {
  let component: StandardRelativeTimeRangeComponent;
  let fixture: ComponentFixture<StandardRelativeTimeRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardRelativeTimeRangeComponent],
      imports: [PipesModule, LuxonModule, StandardCopyModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRelativeTimeRangeComponent);
    component = fixture.componentInstance;
    component.startTimeUtc = DateTime.local().minus({ days: 15 });
    component.endTimeUtc = DateTime.local();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
