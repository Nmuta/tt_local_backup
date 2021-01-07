import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GravityPlayerSelectionComponent } from './gravity-player-selection.component';
import { createMockGravityService, GravityService } from '@services/gravity';

describe('GravityPlayerSelectionComponent', () => {
  let fixture: ComponentFixture<GravityPlayerSelectionComponent>;
  let component: GravityPlayerSelectionComponent;

  let mockGravityService: GravityService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [GravityPlayerSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockGravityService()],
      }).compileComponents();

      const injector = getTestBed();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockGravityService = injector.inject(GravityService);

      fixture = TestBed.createComponent(GravityPlayerSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: makeRequestToValidateIds$', () => {

    beforeEach(() => {
      mockGravityService.getPlayerIdentities = jasmine.createSpy('getPlayerIdentities');
    });
    
    it('should call getPlayerIdentities', () => {
      component.makeRequestToValidateIds$(['foo', 'bar'], 'gamertag');
      expect(mockGravityService.getPlayerIdentities).toHaveBeenCalled();
    });
  });
});
