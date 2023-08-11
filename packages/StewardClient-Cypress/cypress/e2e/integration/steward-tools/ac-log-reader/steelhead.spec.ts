import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { stewardUrls } from '@support/steward/urls';
import { clickTopLeftOfBody } from '@support/steward/util/click-top-left-of-body';

context('Steward / Tools / AC Log Reader/ Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.acLogReader.steelhead);
  });

  it('should click the help button to display help then close it', () => {
    cy.get('button').contains('mat-icon', 'help').parents('button').click();
    cy.contains('mat-card-title', 'Anti-Cheat Log Reader Categories').should('exist');
    clickTopLeftOfBody();
    cy.contains('mat-card-title', 'Anti-Cheat Log Reader Categories').should('not.exist');
  });

  it('should upload a game crash log file and populate the page', () => {
    cy.get('input[type=file]').selectFile('2023 03 13 - Crash_Info.log');
    cy.contains('p', 'Build version 0001.0008.0003 [Feb 14 2023, 12:37:08]').should('exist');
    cy.contains(
      'p',
      '[ 0010 : 0020 ] Inject | (WSM) Not fully signed : WFS : upnp.dll |UPnP Control Point API| E+3b1b7975ba21bb033d347d2b969822e6dd83bd24d1f980e9349a318d9568afac',
    ).should('exist');
    cy.contains('p', '[ 0020 : 8101 ] Event | Hard Exit : HXT : CME').should('exist');
  });
});
