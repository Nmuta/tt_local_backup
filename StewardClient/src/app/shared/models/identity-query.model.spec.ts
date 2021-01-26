import { isGamertagQuery, isT10IdQuery, isXuidQuery } from './identity-query.model';

function expectTypes(
  query: unknown,
  gamertagState: boolean,
  xuidState: boolean,
  t10IdState: boolean,
) {
  expect(isGamertagQuery(query)).toBe(gamertagState);
  expect(isXuidQuery(query)).toBe(xuidState);
  expect(isT10IdQuery(query)).toBe(t10IdState);
}

describe('identity query models', () => {
  describe('gamertag query', () => {
    const query = { gamertag: 'gamertag' };
    it('should detect type properly', () => {
      expectTypes(query, true, false, false);
    });
  });

  describe('xuid query', () => {
    const query = { xuid: 'xuid' };
    it('should detect type properly', () => {
      expectTypes(query, false, true, false);
    });
  });

  describe('t10Id query', () => {
    const query = { t10Id: 't10Id' };
    it('should detect type properly', () => {
      expectTypes(query, false, false, true);
    });
  });
});
