import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { AuctionBlocklistComponent } from './auction-blocklist.component';

describe('AuctionBlocklistComponent', () => {
  let component: AuctionBlocklistComponent;
  let fixture: ComponentFixture<AuctionBlocklistComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [AuctionBlocklistComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(AuctionBlocklistComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionBlocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
