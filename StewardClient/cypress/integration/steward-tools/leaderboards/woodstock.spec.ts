import env from '@support/env';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { inputHasValue } from '@support/mat-form/input-has-value';
import {
  pressSearch,
  fillLeaderboardFieldsNoFilter,
  fillLeaderboardFieldsOneFilter,
  fillLeaderboardFieldsAllScoreTypeFilters,
  fillLeaderboardFieldsAllCarClassFilters,
  fillLeaderboardFieldsAllFilters,
  fillLeaderboardFieldsNoFilterFakeBoard,
} from './page';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';

context('Steward / Tools / Leaderboads', () => {
  beforeEach(() => {
    login();

    disableFakeApi();
  });

  context('Default route', () => {
    beforeEach(() => {
      cy.visit(stewardUrls.tools.leaderboards.default);
    });

    it('should be on Woodstock', () => {
      cy.contains('a', 'FH5').should('have.class', 'mat-stroked-button');
    });

    it('player XUID should be empty', () => {
      waitForProgressSpinners();
      inputHasValue('XUID', '');
    });

    it('should have correct links to other titles', () => {
      cy.contains('a', 'FH5').should(env.testTitle.woodstock ? 'exist' : 'not.exist');
      cy.contains('a', 'FM').should(env.testTitle.steelhead ? 'exist' : 'not.exist');
    });

    it('should contain leaderboard data for Prod, No Filters, Valid Board', () => {
      fillLeaderboardFieldsNoFilter(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - All Device Types - Rivals',
      ).should('exist');
    });

    it('should not allow search data for Prod, No Filters, invalid board', () => {
      fillLeaderboardFieldsNoFilterFakeBoard('Prod', 'Totally real board');
      cy.contains('button', 'Search Leaderboard').should('have.class', 'mat-button-disabled');
    });

    it('should contain leaderboard data for Prod, No Filters, Valid Board, XUID', () => {
      fillLeaderboardFieldsNoFilter(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      cy.contains('mat-form-field', 'Player XUID').type(RetailUsers['chad'].xuid);
      pressSearch();
      waitForProgressSpinners();
      cy.contains('td', RetailUsers['chad'].xuid).should('exist');
    });

    it('should not contain leaderboard data for Prod, No Filters, Valid Board, xuid for player with no data', () => {
      fillLeaderboardFieldsNoFilter(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      cy.contains('mat-form-field', 'Player XUID').type(RetailUsers['jordan'].xuid);
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'span',
        `Player's score doesnt exist or has been deleted: 2535435129485725`,
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, No Filters, Valid Board, Device Type', () => {
      fillLeaderboardFieldsNoFilter(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      cy.contains('mat-form-field', 'Device Type').click();
      cy.contains('mat-option', 'Steam').click();
      cy.get('body').click(); // Remove focus from select dropdown
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - Steam - Rivals',
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, No Filters, Valid Board, Multiple Device Types', () => {
      fillLeaderboardFieldsNoFilter(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      cy.contains('mat-form-field', 'Device Type').click();
      cy.contains('mat-option', 'Steam').click();
      cy.contains('mat-option', 'Xbox One').click();
      cy.get('body').click(); // Remove focus from select dropdown
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - Steam, Xbox One - Rivals',
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, One Filter, Valid Board', () => {
      fillLeaderboardFieldsOneFilter(
        'Prod',
        'Laptime',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - All Device Types - Rivals',
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, All ScoreType Filters, Valid Board', () => {
      fillLeaderboardFieldsAllScoreTypeFilters(
        'Prod',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - All Device Types - Rivals',
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, All CarClass Filters, Valid Board', () => {
      fillLeaderboardFieldsAllCarClassFilters('Prod', 'Bahía de Plano Circuit - D Class Laptime');
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        'Bahía de Plano Circuit - D Class Laptime - All Device Types - Non Class Specific Event',
      ).should('exist');
    });

    it('should contain leaderboard data for Prod, All Filters', () => {
      fillLeaderboardFieldsAllFilters('Prod', 'Bahía de Plano Circuit - D Class Laptime');
      pressSearch();
      cy.contains(
        'mat-card-subtitle',
        'Bahía de Plano Circuit - D Class Laptime - All Device Types - Non Class Specific Event',
      ).should('exist');
    });

    it('should switch from Prod to Dev', () => {
      cy.contains('mat-form-field', 'Leaderboard Environment').click();
      cy.contains('mat-option', 'Dev').click();
      waitForProgressSpinners();
      cy.contains('span', 'Dev').should('exist');
    });

    it('should contain leaderboard data for Dev, No Filters, Valid Board', () => {
      fillLeaderboardFieldsNoFilter(
        'Dev',
        '2021-08-19 - 2021-11-11 - HORIZON BAJA SCRAMBLE Laptime',
      );
      pressSearch();
      waitForProgressSpinners();
      cy.contains(
        'mat-card-subtitle',
        '2021 -08 -19 - 2021 -11 -11 - HORIZON BAJA SCRAMBLE Laptime - All Device Types - Rivals',
      ).should('exist');
    });
  });
});
