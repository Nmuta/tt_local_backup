import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloPlayerSelectionComponent } from './apollo-player-selection.component';
import { ApolloService, createMockMockApolloService } from '@services/apollo';

describe('ApolloPlayerSelectionComponent', () => {
  let fixture: ComponentFixture<ApolloPlayerSelectionComponent>;
  let component: ApolloPlayerSelectionComponent;

  let mockApolloService: ApolloService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule.withRoutes([]),
          HttpClientTestingModule,
          NgxsModule.forRoot(),
        ],
        declarations: [ApolloPlayerSelectionComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          createMockMockApolloService()
        ],
      }).compileComponents();

      const injector = getTestBed();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      mockApolloService = injector.inject(ApolloService);

      fixture = TestBed.createComponent(ApolloPlayerSelectionComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
