import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ContentCollapseComponent } from './content-collapse.component';
import { createMockClipboard, Clipboard } from '@shared/helpers/clipboard';

describe('ContentCollapseComponent', () => {
  let fixture: ComponentFixture<ContentCollapseComponent>;
  let component: ContentCollapseComponent;

  let mockClipboard: Clipboard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ContentCollapseComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [createMockClipboard()],
    }).compileComponents();

    const injector = getTestBed();
    mockClipboard = injector.get(Clipboard);

    fixture = TestBed.createComponent(ContentCollapseComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
