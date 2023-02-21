import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPages } from '@environments/app-data/tool-list/tiles/external-dropdown/admin-pages';
import {
  AppIcon,
  CommonAccessLevels,
  ExtraIcon,
  HomeTileInfoMultiExternal,
  NavbarTool,
} from '@environments/environment';

import { ExternalDropdownComponent } from './external-dropdown.component';

describe('ExternalDropdownComponent', () => {
  let component: ExternalDropdownComponent;
  let fixture: ComponentFixture<ExternalDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDropdownComponent);
    component = fixture.componentInstance;
    component.item = <HomeTileInfoMultiExternal>{
      icon: AppIcon.DeveloperTool,
      extraIcon: ExtraIcon.External,
      tool: NavbarTool.AdminPagesSelector,
      accessList: CommonAccessLevels.AdminPageAccess,
      title: 'Admin Pages',
      subtitle: 'Production / Flight / Dev',
      imageUrl: undefined,
      imageAlt: undefined,
      tooltipDescription: 'Various Admin Pages',
      shortDescription: [`Various Admin Pages`],
      externalUrls: [
        { icon: 'face', text: '(Flight) Steelhead', url: AdminPages.SteelheadFlight },
        { icon: 'face', text: 'FH5', url: AdminPages.FH5 },
        { icon: 'face', text: 'FH4', url: AdminPages.FH4 },
        { icon: 'face', text: 'FM7', url: AdminPages.FM7 },
        { icon: 'admin_panel_settings', text: '(Dev) Steelhead', url: AdminPages.SteelheadStudio },
        { icon: 'admin_panel_settings', text: '(Dev) FH5', url: AdminPages.FH5Studio },
        { icon: 'admin_panel_settings', text: '(Dev) FH4', url: AdminPages.FH4Studio },
        { icon: 'admin_panel_settings', text: '(Dev) FM7', url: AdminPages.FM7Studio },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
