import { ApolloEndpointKey, GameTitleCodeName, SunriseEndpointKey } from '@models/enums';
import { overrideApolloEndpointKey, overrideSunriseEndpointKey } from './override-endpoint-key';

describe('Helper: override-endpoint-key', () => {
  describe('Method: overrideSunriseEndpointKey', () => {
    const endpointKey = SunriseEndpointKey.Retail;

    it('should set correct endpoint key header', () => {
      const headers = overrideSunriseEndpointKey(endpointKey);

      expect(headers.has('endpointKey')).toBeTruthy();
      expect(headers.get('endpointKey')).toEqual(`${GameTitleCodeName.FH4}|${endpointKey}`);
    });
  });

  describe('Method: overrideApolloEndpointKey', () => {
    const endpointKey = ApolloEndpointKey.Retail;

    it('should set correct endpoint key header', () => {
      const headers = overrideApolloEndpointKey(endpointKey);

      expect(headers.has('endpointKey')).toBeTruthy();
      expect(headers.get('endpointKey')).toEqual(`${GameTitleCodeName.FM7}|${endpointKey}`);
    });
  });
});
