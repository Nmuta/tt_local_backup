import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateBulkAuctionComponent } from './create-bulk-auction.component';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('CreateBulkAuctionComponent', () => {
  let component: CreateBulkAuctionComponent;
  let fixture: ComponentFixture<CreateBulkAuctionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [CreateBulkAuctionComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBulkAuctionComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
