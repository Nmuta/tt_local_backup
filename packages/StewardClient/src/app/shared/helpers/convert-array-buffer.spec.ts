import { arrayBufferToBase64, base64ToArrayBuffer } from './convert-array-buffer';
const base64String = 'SGVsbG8gV29ybGQh';

describe('Helper: convert-array-buffer', () => {
  describe('Method: arrayBufferToBase64', () => {
    it('should convert an empty buffer to an empty string', () => {
      const buffer = new ArrayBuffer(0);
      const response = arrayBufferToBase64(buffer);
      expect(response.length).toBeLessThanOrEqual(0);
    });

    it('should convert to and from array buffer', () => {
      const buffer = base64ToArrayBuffer(base64String);
      const response = arrayBufferToBase64(buffer);
      expect(response).toEqual(base64String);
    });
  });
});
