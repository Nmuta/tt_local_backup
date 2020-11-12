import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentCollapseComponent } from './content-collapse.component';
import { createMockClipboard } from '@shared/helpers/clipboard';

describe('ContentCollapseComponent', () => {
  let fixture: ComponentFixture<ContentCollapseComponent>;
  let component: ContentCollapseComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ContentCollapseComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [createMockClipboard()],
      }).compileComponents();

      fixture = TestBed.createComponent(ContentCollapseComponent);
      component = fixture.debugElement.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
