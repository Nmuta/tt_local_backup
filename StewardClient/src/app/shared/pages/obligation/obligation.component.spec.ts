import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { DataPipelineObligationComponent } from './obligation.component';
import { DataPipelineObligationModule } from './obligation.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataPrivacyNoticeModule } from '@views/data-privacy-notice/data-privacy-notice.module';
import { FourOhFourModule } from '@views/four-oh-four/four-oh-four.module';
import { SidebarIconsModule } from '@views/sidebar-icons/sidebar-icons.module';
import { SidebarsModule } from 'app/sidebars/sidebars.module';
import { By } from '@angular/platform-browser';

@Component({
  template: '<hook-to-test-obligation-page></hook-to-test-obligation-page>',
})
class TestHarnessComponent {}

interface DebugElementOverride<T> extends DebugElement {
  context: T;
}

function doQueryByDirective<T>(
  parentDebugElement: DebugElement,
  targetType: Type<T>,
): DebugElementOverride<T> {
  return parentDebugElement.query(By.directive(targetType));
}

describe('DataPipelineObligationComponent', () => {
  let component: TestHarnessComponent;
  let fixture: ComponentFixture<TestHarnessComponent>;
  let rootElement: DebugElementOverride<DataPipelineObligationComponent>;
  let rootComponent: DataPipelineObligationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        DataPipelineObligationModule,
        NoopAnimationsModule,
        DataPrivacyNoticeModule,
        SidebarsModule,
        FontAwesomeModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        FontAwesomeModule,
        FourOhFourModule,
        MatCardModule,
        SidebarIconsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TestHarnessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHarnessComponent);
    component = fixture.componentInstance;
    rootElement = doQueryByDirective(fixture.debugElement, DataPipelineObligationComponent);
    rootComponent = rootElement.context;
    fixture.detectChanges();
  });

  it('should create and get keystone elements', () => {
    expect(component).toBeTruthy();
    expect(rootElement).toBeTruthy();
    expect(rootComponent).toBeTruthy();
  });
});
