import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import {
  testInputUgcID,
  verifyUgcCreatedDate,
  woodstockUgcCreatedDate,
  woodstockUgcID,
} from './shared-functions';

context('Steward / Tools / UGC Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugc_details.woodstock);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testInputUgcID(woodstockUgcID.Livery);
      verifyUgcCreatedDate(woodstockUgcCreatedDate.Livery);
    });

    it('should find Layer Group data', () => {
      testInputUgcID(woodstockUgcID.LayerGroup);
      verifyUgcCreatedDate(woodstockUgcCreatedDate.LayerGroup);
    });

    it('should find Photo data', () => {
      testInputUgcID(woodstockUgcID.Photo);
      verifyUgcCreatedDate(woodstockUgcCreatedDate.Photo);
    });

    it('should find Tune data', () => {
      testInputUgcID(woodstockUgcID.Tune);
      verifyUgcCreatedDate(woodstockUgcCreatedDate.Tune);
    });

    //No Known Events to Test
    // it('should find Events data', () => {
    //   testInputUgcID('*insert ugcid here*');
    //verifyUgcCreatedDate('*insert created date here*');
    // });

    //No Known Community Challenges to Test
    // it('should find Events data', () => {
    //   testInputUgcID('*insert ugcid here*');
    //verifyUgcCreatedDate('*insert created date here*');
    // });
  });
});
