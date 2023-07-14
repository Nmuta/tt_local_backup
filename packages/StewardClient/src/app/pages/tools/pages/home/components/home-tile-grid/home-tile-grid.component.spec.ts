import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createStandardTestModuleMetadata } from '@mocks/standard-test-module-metadata';
import { ZendeskService } from '@services/zendesk';
import { of } from 'rxjs';
import { ToolsAppHomeTileGridComponent } from './home-tile-grid.component';

describe('ToolsAppHomeTileGridComponent', () => {
  let component: ToolsAppHomeTileGridComponent;
  let fixture: ComponentFixture<ToolsAppHomeTileGridComponent>;

  let mockZendeskService: ZendeskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadata({ declarations: [ToolsAppHomeTileGridComponent] }),
    ).compileComponents();

    fixture = TestBed.createComponent(ToolsAppHomeTileGridComponent);
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
