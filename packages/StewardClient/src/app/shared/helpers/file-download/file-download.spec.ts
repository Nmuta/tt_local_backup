import { downloadJsonFile } from './file-download';

describe('downloadJsonFile', () => {
  it('should not throw', () => {
    downloadJsonFile('file name', 'file content');
  });
});
