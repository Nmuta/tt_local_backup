import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OpusPlayerSelectionComponent } from './opus-player-selection.component';
import { createMockMockOpusService, OpusService } from '@services/opus';

describe('OpusPlayerSelectionComponent', () => {
  let fixture: ComponentFixture<OpusPlayerSelectionComponent>;
  let component: OpusPlayerSelectionComponent;

  let mockOpusService: OpusService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [OpusPlayerSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockMockOpusService()
        ],
      }).compileComponents();

      const injector = getTestBed();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockOpusService = injector.inject(OpusService);

      fixture = TestBed.createComponent(OpusPlayerSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
