import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Clipboard } from './clipboard.helper';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe(
'ClipboardHelper', () => {
  let clipboard: Clipboard;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      createStandardTestModuleMetadataMinimal({
        declarations: [],
        providers: [Clipboard],
        schemas: [NO_ERRORS_SCHEMA],
      }),
    ).compileComponents();

    clipboard = TestBed.inject(Clipboard);
  });

  it('should create', () => {
    expect(clipboard).toBeTruthy();
  });

  it('copy should not throw', () => {
    clipboard.copyMessage('hello world');
  });
});
