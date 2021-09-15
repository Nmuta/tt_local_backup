import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityMessagingComponent } from './community-messaging.component';

describe('CommunityMessagingComponent', () => {
  let component: CommunityMessagingComponent;
  let fixture: ComponentFixture<CommunityMessagingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
        declarations: [CommunityMessagingComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(CommunityMessagingComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnInit', () => {
    it('should set navbarRouterLinks', () => {
      expect(component.navbarRouterLinks.length).toEqual(0);
      component.ngOnInit();

      expect(component.navbarRouterLinks.length).toEqual(1);
    });
  });
});
