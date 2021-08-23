import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WoodstockEndpointKey, GameTitleCodeName } from '@models/enums';

import { EndpointSelectionComponent } from './endpoint-selection.component';

describe('EndpointSelectionComponent', () => {
  let component: EndpointSelectionComponent;
  let fixture: ComponentFixture<EndpointSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Method: ngOnChanges', () => {
    describe('when titleCodeName is valid', () => {
      beforeEach(() => {
        component.titleCodeName = GameTitleCodeName.FH5;
      });
      it('Should display proper endpoint value after initialization', () => {
        component.ngOnInit();
        expect(component.displayEndpointName).toEqual(WoodstockEndpointKey.Development);
      });
    });
    describe('when titleCodeName is invalid', () => {
      beforeEach(() => {
        component.titleCodeName = GameTitleCodeName.FH3;
      });
      it('Should display proper endpoint value after initialization', () => {
        component.ngOnInit();
        expect(component.displayEndpointName).toEqual('');
      });
    });
  });
});
