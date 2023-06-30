import { login } from '@support/steward/auth/login';
import { stewardUrls } from '@support/steward/urls';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { testLivery, testPhoto, testTuneBlob } from './shared-functions';

context('Steward / Tools / UGC Details / Woodstock', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.ugc_details.steelhead);
  });

  context('Basic Tests', () => {
    it('should find Livery data', () => {
      testLivery('f9e7ad6f-2ad0-4585-915d-e1615c4ffe2f', '4/14/23 6:01:26 PM');
    });

    it('should find Photo data', () => {
      testPhoto('8f16ac0c-fb40-4781-915a-3bb3d47a9271', '6/10/23 12:40:28 PM');
    });

    it('should find Tune Blob data', () => {
      testTuneBlob('8974773c-b2b4-4f10-8b13-a40dd815471c', '6/10/23 12:13:49 PM');
    });
  });
});
