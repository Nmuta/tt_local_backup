import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AppIcon,
  CommonAccessLevels,
  ExtraIcon,
  HomeTileInfoCustomTile,
  NavbarTool,
} from '@environments/environment';
import { NgxsModule } from '@ngxs/store';

import { EndpointsNavToolComponent } from './endpoints-nav-tool.component';

describe('EndpointsNavToolComponent', () => {
  let component: EndpointsNavToolComponent;
  let fixture: ComponentFixture<EndpointsNavToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [EndpointsNavToolComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsNavToolComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    component.item = <HomeTileInfoCustomTile>{
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
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
