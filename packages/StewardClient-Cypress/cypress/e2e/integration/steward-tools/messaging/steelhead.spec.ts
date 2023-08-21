import {
  searchByGtag,
  searchByXuid,
  selectLspGroup,
} from '@support/steward/shared-functions/searching';
import { StudioUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { DateTime } from 'luxon';
import { stewardUrls } from '@support/steward/urls';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';

context('Steward / Tools / Messaging / Steelhead', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.messaging.steelhead);
    changeEndpoint('Steelhead', 'Flight', 'Studio');
  });

  context('GTAG Lookup', () => {
    before(() => {
      searchByGtag(StudioUsers['caleb'].gtag);
    });

    context('Default State Checks', () => {
      verifyNoInputsLocalizedMessageTest();
    });

    context('Valid Inputs Checks', () => {
      verifyCreateLocalizedMessage();
      removeLocalizedMessagePR();
      verifyMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidLocalizedMessageTest();
    });
  });

  context('XUID Lookup', () => {
    before(() => {
      searchByXuid(StudioUsers['caleb'].xuid);
    });

    context('Default State Checks', () => {
      verifyNoInputsLocalizedMessageTest();
    });

    context('Valid Inputs Checks', () => {
      verifyCreateLocalizedMessage();
      removeLocalizedMessagePR();
      verifyMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidLocalizedMessageTest();
    });
  });

  context('GroupId Lookup', () => {
    before(() => {
      selectLspGroup('LiveOpsTestingGroup');
    });

    context('Default State Checks', () => {
      verifyNoInputsLocalizedMessageTest();
    });

    context('Valid Inputs Checks', () => {
      verifyCreateLocalizedMessage();
      removeLocalizedMessagePR();
      verifyLSPMessageSent();
    });

    context('Invalid Inputs Checks', () => {
      verifyInvalidDateInputTest();
      verifyInvalidLocalizedMessageTest();
    });
  });
});

function verifyNoInputsLocalizedMessageTest(): void {
  it('should not be reviewable without any inputs', () => {
    cy.contains('button', 'Submit', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyCreateLocalizedMessage(): void {
  it('should create a valid Localized Message', () => {
    cy.get('[role="tab"]').contains('Create').click();
    cy.contains('mat-form-field', 'String To Localize')
      .click()
      .type('{selectall}{backspace}This is a test string.');
    cy.contains('mat-form-field', 'Description')
      .click()
      .type('{selectall}{backspace}This is a test string');
    cy.contains('mat-form-field', 'Category').click();
    cy.contains('mat-option', 'Notifications').click();
    cy.contains('mat-form-field', 'Sub-Category').click();
    cy.contains('mat-option', 'Description').click();

    cy.get('button').contains('mat-icon', 'lock_open').click();
    cy.contains('button', 'Submit', { matchCase: false }).should(
      'not.have.class',
      'mat-button-disabled',
    );
    cy.contains('button', 'Submit').click();
    waitForProgressSpinners();
    cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found').should(
      'exist',
    );
  });
}

function removeLocalizedMessagePR(): void {
  it('should abandon previously created pr', () => {
    waitForProgressSpinners();
    cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found')
      .parents('tr')
      .contains('mat-icon', 'lock_open')
      .click();
    cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found')
      .parents('tr')
      .contains('span', 'Abandon')
      .click();
    cy.contains('a', 'Edits LocalizationString from Steward. Author: Email not found').should(
      'not.exist',
    );
  });
}

function verifyMessageSent(): void {
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should send with proper inputs', () => {
    cy.get('[role="tab"]').contains('Send').click();

    cy.contains('mat-form-field', 'Select localized title').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Select localized message').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Date Range')
      .click()
      .type('{selectall}' + expiryString);
    cy.contains('mat-form-field', 'Start Time').click().type('{selectall}{backspace}23:59');
    cy.contains('mat-form-field', 'End Time').click().type('{selectall}{backspace}00:01');
    cy.contains('mat-form-field', 'Notification Type').click();
    cy.contains('mat-option', 'Community Message').click();
    cy.contains('button', 'Review', { matchCase: false }).click();
    cy.contains('button', 'Send message to players', { matchCase: false }).click();
    waitForProgressSpinners();
    cy.contains('button', 'Send Another Message', { matchCase: false }).should('exist');
  });
}

function verifyLSPMessageSent(): void {
  const expiryString = DateTime.local().plus({ days: 1 }).toLocaleString();

  it('should send with proper inputs', () => {
    cy.get('[role="tab"]').contains('Send').click();

    cy.contains('mat-form-field', 'Select localized title').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Select localized message').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Date Range')
      .click()
      .type('{selectall}' + expiryString);
    cy.contains('mat-form-field', 'Start Time').click().type('{selectall}{backspace}23:59');
    cy.contains('mat-form-field', 'End Time').click().type('{selectall}{backspace}00:01');
    cy.contains('mat-form-field', 'Notification Type').click();
    cy.contains('mat-option', 'Community Message').click();
    cy.contains('button', 'Review', { matchCase: false }).click();
    cy.contains('button', 'Send message to LSP Group', { matchCase: false }).click();
    waitForProgressSpinners();
    cy.contains('button', 'Send Another Message', { matchCase: false }).should('exist');
  });
}

function verifyInvalidDateInputTest(): void {
  it('should not be reviewable with invalid date input', () => {
    cy.get('[role="tab"]').contains('Send').click();
    cy.contains('button', 'Send Another Message', { matchCase: false }).click();
    cy.contains('mat-form-field', 'Select localized title').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Select localized message').click();
    cy.contains('mat-option', 'Test string').click();
    cy.contains('mat-form-field', 'Date Range').click().type('{ctrl+a}1/1/2001');
    cy.contains('button', 'Review', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}

function verifyInvalidLocalizedMessageTest(): void {
  const longString = new Array(600).join('f');

  it('should not be reviewable with invalid message input', () => {
    cy.get('[role="tab"]').contains('Create').click();
    cy.contains('mat-form-field', 'String To Localize')
      .click()
      .type('{selectall}{backspace}' + longString);
    cy.contains('mat-form-field', 'Description')
      .click()
      .type('{selectall}{backspace}' + longString);
    cy.contains('mat-form-field', 'Category').click();
    cy.contains('mat-option', 'Notifications').click();
    cy.contains('mat-form-field', 'Sub-Category').click();
    cy.contains('mat-option', 'Description').click();
    cy.get('button').contains('mat-icon', 'lock_open').click();
    cy.contains('button', 'Submit', { matchCase: false }).should(
      'have.class',
      'mat-button-disabled',
    );
  });
}
