import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { testInputUGCID } from './shared-functions';

context('Steward / Tools / UGC Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugc_details.woodstock);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUGCID('c5329e63-3c1f-4d60-b251-9e69cb2aeda7', '11/9/21 5:48:05 PM');
    });

    it('should find Layer Group data', () => {
      testInputUGCID('307916c9-e492-4b57-af6e-815bb5e068f9', '2/8/22 11:40:02 AM');
    });

    it('should find Photo data', () => {
      testInputUGCID('12555e32-9e02-452b-b4ee-a1886c5a40a2', '2/8/22 3:13:50 PM');
    });

    it('should find Tune data', () => {
      testInputUGCID('27f5873f-de88-406d-829e-9eb8658cd511', '2/8/22 3:16:11 PM');
    });

    //No Known Events to Test
    // it('should find Events data', () => {
    //   testInputUGCID('*insert ugcid here*', '*insert created date here*');
    // });

    //No Known Community Challenges to Test
    // it('should find Events data', () => {
    //   testInputUGCID('*insert ugcid here*', '*insert created date here*');
    // });
  });
});
