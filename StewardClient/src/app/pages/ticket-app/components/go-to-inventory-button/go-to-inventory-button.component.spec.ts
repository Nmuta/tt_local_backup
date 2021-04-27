import BigNumber from 'bignumber.js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { createMockZendeskService } from '@services/zendesk';
import faker from 'faker';

import { GoToInventoryButtonComponent } from './go-to-inventory-button.component';

describe('GoToInventoryButtonComponent', () => {
  let component: GoToInventoryButtonComponent;
  let fixture: ComponentFixture<GoToInventoryButtonComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoToInventoryButtonComponent],
      providers: [createMockZendeskService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToInventoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  beforeEach(() => {
    window.open = jasmine.createSpy('open').and.callThrough();
  });

  describe('Method goToInventory:', () => {
    const xuid = new BigNumber(faker.datatype.number());
    const gameTitle = GameTitleCodeName.Street;
    beforeEach(() => {
      component.xuid = xuid;
      component.gameTitle = gameTitle;
    });

    it('should call window.open with correct link', () => {
      component.goToInventory();

      const expectedUrl = `${
        environment.stewardUiUrl
      }/support/navbar-app/tools/user-details/${gameTitle.toLowerCase()}?lookupType=xuid&lookupName=${xuid}`;

      expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank');
    });
  });
});
