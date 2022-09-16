import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime } from 'luxon';
import { LuxonModule } from 'luxon-angular';

import { StandardRelativeTimeComponent } from './standard-relative-time.component';

describe('StandardRelativeTimeComponent', () => {
  let component: StandardRelativeTimeComponent;
  let fixture: ComponentFixture<StandardRelativeTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardRelativeTimeComponent],
      imports: [PipesModule, LuxonModule, StandardCopyModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRelativeTimeComponent);
    component = fixture.componentInstance;
    component.timeUtc = DateTime.local().minus({ days: 15 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
