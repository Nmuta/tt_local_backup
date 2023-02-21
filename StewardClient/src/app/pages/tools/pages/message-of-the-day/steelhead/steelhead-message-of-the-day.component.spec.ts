import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SteelheadMessageOfTheDayService } from '@services/api-v2/steelhead/message-of-the-day/steelhead-message-of-the-day.service';
import { createMockSteelheadMessageOfTheDayService } from '@services/api-v2/steelhead/message-of-the-day/steelhead-message-of-the-day.service.mock';
import { SteelheadMessageOfTheDayComponent } from './steelhead-message-of-the-day.component';

describe('SteelheadMessageOfTheDayComponent', () => {
  let component: SteelheadMessageOfTheDayComponent;
  let fixture: ComponentFixture<SteelheadMessageOfTheDayComponent>;
  let mockMotdService: SteelheadMessageOfTheDayService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [SteelheadMessageOfTheDayComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockSteelheadMessageOfTheDayService()],
    }).compileComponents();

    const injector = getTestBed();
    mockMotdService = injector.inject(SteelheadMessageOfTheDayService);

    fixture = TestBed.createComponent(SteelheadMessageOfTheDayComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should call getMessagesOfTheDay', () => {
      component.ngOnInit();

      expect(mockMotdService.getMessagesOfTheDay$).toHaveBeenCalled();
    });
  });
});
