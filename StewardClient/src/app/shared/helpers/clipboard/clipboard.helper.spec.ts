import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Clipboard } from './clipboard.helper';

describe('ClipboardHelper', () => {
  let clipboard: Clipboard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [Clipboard],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    clipboard = TestBed.inject(Clipboard);
  });

  it('should create', () => {
    expect(clipboard).toBeTruthy();
  });

  it('copy should not throw', () => {
    clipboard.copyMessage('hello world');
  });
});