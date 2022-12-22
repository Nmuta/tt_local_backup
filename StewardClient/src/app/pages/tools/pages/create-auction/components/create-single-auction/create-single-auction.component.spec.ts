import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateSingleAuctionComponent } from './create-single-auction.component';
import { HumanizePipe } from '@shared/pipes/humanize.pipe';

describe('CreateSingleAuctionComponent', () => {
  let component: CreateSingleAuctionComponent;
  let fixture: ComponentFixture<CreateSingleAuctionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [CreateSingleAuctionComponent, HumanizePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSingleAuctionComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
