import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GiftBasketBaseComponent } from './gift-basket.base.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('GiftBasketBaseComponent', () => {
  let fixture: ComponentFixture<GiftBasketBaseComponent<IdentityResultBeta>>;
  let component: GiftBasketBaseComponent<IdentityResultBeta>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [GiftBasketBaseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(
        GiftBasketBaseComponent as Type<GiftBasketBaseComponent<IdentityResultBeta>>,
      );
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
