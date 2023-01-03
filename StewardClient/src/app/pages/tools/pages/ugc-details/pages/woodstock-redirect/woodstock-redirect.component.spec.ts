import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ScopedSharedLookupService } from '../../services/scoped-shared-lookup.service';
import { UgcDetailsComponent } from '../../ugc-details.component';

import { WoodstockRedirectComponent } from './woodstock-redirect.component';

describe('WoodstockRedirectComponent', () => {
  let component: WoodstockRedirectComponent;
  let fixture: ComponentFixture<WoodstockRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockRedirectComponent],
      imports: [
        PipesModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ScopedSharedLookupService, UgcDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
