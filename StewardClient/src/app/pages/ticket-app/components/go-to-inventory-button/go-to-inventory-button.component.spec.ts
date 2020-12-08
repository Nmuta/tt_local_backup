import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTitleCodeName } from '@models/enums';
import { createMockZendeskService, ZendeskService } from '@services/zendesk';

import { GoToInventoryButtonComponent } from './go-to-inventory-button.component';

describe('GoToInventoryButtonComponent', () => {
  let component: GoToInventoryButtonComponent;
  let fixture: ComponentFixture<GoToInventoryButtonComponent>;
  let zendesk: ZendeskService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoToInventoryButtonComponent],
      providers: [createMockZendeskService()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    zendesk = TestBed.inject(ZendeskService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoToInventoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should goToInventory()', () => {
    component.xuid = BigInt(123456);
    component.gameTitle = GameTitleCodeName.Street;
    component.goToInventory();
    expect(zendesk.goToApp$).toHaveBeenCalledWith('nav_bar', 'forza-inventory-support', `${component.gameTitle}/${component.xuid}`)
  });
});
