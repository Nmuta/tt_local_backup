import { downloadJsonFile } from './file-download';

import { createStandardTestModuleMetadataMinimal } from '@mocks/standard-test-module-metadata-minimal';

describe('downloadJsonFile', () => {
  it('should not throw', () => {
    downloadJsonFile('file name', 'file content');
  });
});
