import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloGiftBasketComponent } from './apollo-gift-basket.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ApolloGiftBasketComponent', () => {
  let fixture: ComponentFixture<ApolloGiftBasketComponent>;
  let component: ApolloGiftBasketComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
          ReactiveFormsModule,
        ],
        declarations: [ApolloGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      // const injector = getTestBed();

      fixture = TestBed.createComponent(ApolloGiftBasketComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have disableCard set to true', () => {
    expect(component.disableCard).toBeTruthy();
  });
});
