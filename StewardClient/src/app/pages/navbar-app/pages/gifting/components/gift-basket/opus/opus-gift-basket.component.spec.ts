import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OpusGiftBasketComponent } from './opus-gift-basket.component';

describe('OpusGiftBasketComponent', () => {
  let fixture: ComponentFixture<OpusGiftBasketComponent>;
  let component: OpusGiftBasketComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [OpusGiftBasketComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      // const injector = getTestBed();

      fixture = TestBed.createComponent(OpusGiftBasketComponent);
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
