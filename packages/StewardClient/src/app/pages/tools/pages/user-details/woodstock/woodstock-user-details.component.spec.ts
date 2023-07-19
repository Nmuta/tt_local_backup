import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { Subject } from 'rxjs';
import { UserDetailsComponent } from '../user-details.component';

import { WoodstockUserDetailsComponent } from './woodstock-user-details.component';

describe('WoodstockUserDetailsComponent', () => {
  let component: WoodstockUserDetailsComponent;
  let fixture: ComponentFixture<WoodstockUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WoodstockUserDetailsComponent],
      imports: [
        PipesModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot(),
      ],
      providers: [
        {
          provide: UserDetailsComponent,
          useValue: {
            specialIdentitiesAllowed: [],
            identity$: new Subject<AugmentedCompositeIdentity>(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodstockUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
});
