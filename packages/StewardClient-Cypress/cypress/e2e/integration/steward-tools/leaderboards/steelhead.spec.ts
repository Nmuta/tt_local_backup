import env from '@support/env';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { inputHasValue } from '@support/mat-form/input-has-value';
import {
  pressSearch,
  fillLeaderboardFieldsNoFilter,
  fillLeaderboardFieldsOneFilter,
  fillLeaderboardFieldsNoFilterFakeBoard,
} from './page';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

//These tests will need to be updated when Steelhead has more data
context('Steward / Tools / Leaderboads', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('Default route', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.leaderboards.steelhead);
    });

    it('should be on Steelhead', () => {
      cy.contains('a', 'FM').should('have.class', 'mat-stroked-button');
    });

    it('player XUID should be empty', () => {
      inputHasValue('XUID', '');
    });

    it('should have correct links to other titles', () => {
      cy.contains('a', 'FH5').should(env.testTitle.woodstock ? 'exist' : 'not.exist');
      cy.contains('a', 'FM').should(env.testTitle.steelhead ? 'exist' : 'not.exist');
    });

    it('should switch from Prod to Dev', () => {
      cy.contains('mat-form-field', 'Leaderboard Environment').click();
      cy.contains('mat-option', 'Dev').click();
      waitForProgressSpinners();
      cy.contains('span', 'Dev').should('exist');
    });

    it(
      'should contain leaderboard data for Dev, No Filters, Valid Board',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsNoFilter('Dev', 'Spotlight 01 Laptime');
        pressSearch();
        waitForProgressSpinners();
        cy.contains('mat-card-subtitle', 'Spotlight 01 Laptime - All Device Types - Rivals').should(
          'exist',
        );
      },
    );

    it('should not allow search data for Dev, No Filters, invalid board', () => {
      fillLeaderboardFieldsNoFilterFakeBoard('Dev', 'Totally real board');
      cy.contains('button', 'Search Leaderboard').should('have.class', 'mat-button-disabled');
    });

    it(
      'should contain leaderboard data for Dev, No Filters, Valid Board, XUID',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsNoFilter('Dev', 'Spotlight 01 Laptime');
        cy.contains('mat-form-field', 'Player XUID').type(RetailUsers['chad'].xuid);
        pressSearch();
        waitForProgressSpinners();
        cy.contains('td', RetailUsers['chad'].xuid).should('exist');
      },
    );

    it(
      'should not contain leaderboard data for Dev, No Filters, Valid Board, xuid for player with no data',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsNoFilter('Dev', 'Spotlight 01 Laptime');
        cy.contains('mat-form-field', 'Player XUID').type(RetailUsers['jordan'].xuid);
        pressSearch();
        waitForProgressSpinners();
        cy.contains(
          'span',
          `Player's score doesnt exist or has been deleted: 2535435129485725`,
        ).should('exist');
      },
    );

    it(
      'should contain leaderboard data for Dev, No Filters, Valid Board, Device Type',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsNoFilter('Dev', 'Spotlight 01 Laptime');
        cy.contains('mat-form-field', 'Device Type').click();
        cy.contains('mat-option', 'Steam').click();
        cy.get('body').click(); // Remove focus from select dropdown
        pressSearch();
        waitForProgressSpinners();
        cy.contains('mat-card-subtitle', 'Spotlight 01 Laptime - Steam - Rivals').should('exist');
      },
    );

    it(
      'should contain leaderboard data for Dev, No Filters, Valid Board, Multiple Device Types',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsNoFilter('Dev', 'Spotlight 01 Laptime');
        cy.contains('mat-form-field', 'Device Type').click();
        cy.contains('mat-option', 'Steam').click();
        cy.contains('mat-option', 'Xbox One').click();
        cy.get('body').click(); // Remove focus from select dropdown
        pressSearch();
        waitForProgressSpinners();
        cy.contains('mat-card-subtitle', 'Spotlight 01 Laptime - Steam, Xbox One - Rivals').should(
          'exist',
        );
      },
    );

    it(
      'should contain leaderboard data for Dev, One Filter, Valid Board',
      withTags(Tag.Broken),
      () => {
        fillLeaderboardFieldsOneFilter('Dev', 'Laptime', 'Spotlight 01 Laptime');
        pressSearch();
        waitForProgressSpinners();
        cy.contains('mat-card-subtitle', 'Spotlight 01 Laptime - All Device Types - Rivals').should(
          'exist',
        );
      },
    );

    it(
      'should contain leaderboard data for Dev, All ScoreType Filters, Valid Board',
      withTags(Tag.Broken),
      () => {
        cy.contains('mat-form-field', 'Leaderboard Environment').click();
        cy.contains('mat-option', 'Dev').click();
        cy.contains('mat-form-field', 'Leaderboard Filters').click();
        cy.contains('mat-option', 'Laptime').click();
        cy.contains('mat-option', 'DriftPoints').click();
        cy.get('body').click(); // Remove focus from select dropdown
        cy.contains('mat-form-field', 'Leaderboards').click().type('Spotlight 01 Laptime');
        cy.contains('mat-option', 'Spotlight 01 Laptime').click();
        pressSearch();
        waitForProgressSpinners();
        cy.contains('mat-card-subtitle', 'Spotlight 01 Laptime - All Device Types - Rivals').should(
          'exist',
        );
      },
    );

    it(
      'should contain leaderboard data for Dev, All CarClass Filters, Valid Board',
      withTags(Tag.Broken),
      () => {
        cy.contains('mat-form-field', 'Leaderboard Environment').click();
        cy.contains('mat-option', 'Dev').click();
        cy.contains('mat-form-field', 'Leaderboard Filters').click();
        cy.contains('mat-option', 'A Car Class').click();
        cy.get('body').click(); // Remove focus from select dropdown
        cy.contains('mat-form-field', 'Leaderboards').click().type('TEST - Drift Drift Points');
        cy.contains('mat-option', 'TEST - Drift Drift Points').click();
        pressSearch();
        waitForProgressSpinners();
        cy.contains(
          'mat-card-subtitle',
          'TEST - Drift Drift Points - All Device Types - Rivals',
        ).should('exist');
      },
    );

    it('should contain leaderboard data for Dev, All Filters', withTags(Tag.Broken), () => {
      cy.contains('mat-form-field', 'Leaderboard Environment').click();
      cy.contains('mat-option', 'Dev').click();
      cy.contains('mat-form-field', 'Leaderboard Filters').click();
      cy.contains('mat-option', 'Laptime').click();
      cy.contains('mat-option', 'DriftPoints').click();
      cy.contains('mat-option', 'A Car Class').click();
      cy.get('body').click(); // Remove focus from select dropdown
      cy.contains('mat-form-field', 'Leaderboards').click().type('TEST - Drift Drift Points');
      cy.contains('mat-option', 'TEST - Drift Drift Points').click();
      pressSearch();
      cy.contains(
        'mat-card-subtitle',
        'TEST - Drift Drift Points - All Device Types - Rivals',
      ).should('exist');
    });
  });
});
