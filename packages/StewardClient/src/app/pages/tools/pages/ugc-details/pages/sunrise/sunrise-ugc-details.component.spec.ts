import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';

import { SunriseUgcDetailsComponent } from './sunrise-ugc-details.component';

describe('SunriseUgcDetailsComponent', () => {
  let component: SunriseUgcDetailsComponent;
  let fixture: ComponentFixture<SunriseUgcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SunriseUgcDetailsComponent],
      imports: [
        PipesModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
      ],
      providers: [ScopedSharedLookupService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SunriseUgcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
