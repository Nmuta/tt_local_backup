import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { ZendeskService } from '@services/zendesk';
import { of } from 'rxjs';

import { ToolsAppHomeComponent } from './home.component';

describe('ToolsAppHomeComponent', () => {
  let component: ToolsAppHomeComponent;
  let fixture: ComponentFixture<ToolsAppHomeComponent>;

  let mockZendeskService: ZendeskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({ declarations: [ToolsAppHomeComponent] }),
    ).compileComponents();

    fixture = TestBed.createComponent(ToolsAppHomeComponent);
    component = fixture.componentInstance;

    mockZendeskService = TestBed.inject(ZendeskService);
    Object.defineProperty(mockZendeskService, 'inZendesk$', { value: of(false) });

    Object.defineProperty(component, 'profile$', { writable: true });
    component.profile$ = of();

    Object.defineProperty(component, 'settings$', { writable: true });
    component.settings$ = of();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
