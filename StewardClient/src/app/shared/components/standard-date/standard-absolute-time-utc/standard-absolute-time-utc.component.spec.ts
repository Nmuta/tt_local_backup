import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DateTime } from 'luxon';
import { LuxonModule } from 'luxon-angular';
import { StandardAbsoluteTimeUtcComponent } from './standard-absolute-time-utc.component';

describe('StandardAbsoluteTimeUtcComponent', () => {
  let component: StandardAbsoluteTimeUtcComponent;
  let fixture: ComponentFixture<StandardAbsoluteTimeUtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StandardAbsoluteTimeUtcComponent],
      imports: [PipesModule, LuxonModule, StandardCopyModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAbsoluteTimeUtcComponent);
    component = fixture.componentInstance;
    component.timeUtc = DateTime.local().minus({ days: 15 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
