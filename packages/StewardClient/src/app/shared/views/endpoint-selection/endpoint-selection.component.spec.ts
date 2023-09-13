import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import faker from '@faker-js/faker';
import { GameTitleCodeName } from '@models/enums';
import { NgxsModule } from '@ngxs/store';
import { UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { of } from 'rxjs';
import { EndpointSelectionComponent } from './endpoint-selection.component';

describe('EndpointSelectionComponent', () => {
  const endpoint = faker.random.word();
  const validGameTitle = GameTitleCodeName.FH5;
  const invalidGameTitle = GameTitleCodeName.FH3;
  let component: EndpointSelectionComponent;
  let fixture: ComponentFixture<EndpointSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointSelectionComponent],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointSelectionComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of({
      enableFakeApi: false,
      appVersion: '',
      showAppUpdatePopup: false,
      apolloEndpointKey: endpoint,
      sunriseEndpointKey: endpoint,
      woodstockEndpointKey: endpoint,
      steelheadEndpointKey: endpoint,
      navbarTools: null,
    } as UserSettingsStateModel);
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('when titleCodeName is valid', () => {
    it('Should display proper endpoint value after initialization', waitForAsync(() => {
      component.titleCodeName = validGameTitle;
      fixture.detectChanges();
      expect(component.displayEndpointName).toEqual(endpoint);
    }));
  });
  describe('when titleCodeName is invalid', () => {
    it('Should display proper endpoint value after initialization', waitForAsync(() => {
      component.titleCodeName = invalidGameTitle;
      fixture.detectChanges();
      expect(component.displayEndpointName).toEqual('');
    }));
  });
});
