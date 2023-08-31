import env from '@support/env';
import { login } from '@support/steward/auth/login';
import { disableFakeApi } from '@support/steward/util/disable-fake-api';
import { inputHasValue } from '@support/mat-form/input-has-value';
import {
  pressSearch,
  selectLeaderboardEnvironment,
  clickFliters,
  enterLeaderboardName,
  enterUserXuid,
  clickAllFiltersInGroups,
  clickDeviceTypes,
} from './page';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { stewardUrls } from '@support/steward/urls';
import { withTags, Tag } from '@support/tags';

const devLeaderboardToSearch: string = 'River Scramble - A Class Laptime';
const prodLeaderboardToSearch: string = 'Bahía de Plano Circuit - D Class';
const validUserToSearch = RetailUsers['chad'];

context('Steward / Tools / Leaderboads', withTags(Tag.UnitTestStyle), () => {
  before(() => {
    login();

    disableFakeApi();
    cy.visit(stewardUrls.tools.leaderboards.default);
    waitForProgressSpinners();
    waitForProgressSpinners();
  });

  context('Default route', () => {
    it('should be on Woodstock, have an empty XUID, and have links to other titles', () => {
      cy.contains('a', 'FH5').should('have.class', 'mat-stroked-button');
      inputHasValue('XUID', '');
      cy.contains('a', 'FH5').should(env.testTitle.woodstock ? 'exist' : 'not.exist');
      cy.contains('a', 'FM').should(env.testTitle.steelhead ? 'exist' : 'not.exist');
    });

    it('should not be able to search an invalid board', () => {
      selectLeaderboardEnvironment('Dev');
      cy.contains('mat-form-field', 'Leaderboards').click();
      cy.contains('mat-form-field', 'Leaderboards').type('Totally real board');
      cy.contains('button', 'Search Leaderboard').should('have.class', 'mat-button-disabled');
    });

    it('should contain leaderboard data for Prod, All Filters, Specific user', () => {
      selectLeaderboardEnvironment('Prod');
      clickAllFiltersInGroups(['CarClass', 'ScoreType']);
      enterLeaderboardName(prodLeaderboardToSearch);
      enterUserXuid(validUserToSearch.xuid);
      pressSearch();
      cy.contains('mat-card-subtitle', prodLeaderboardToSearch).should('exist');
      cy.get('leaderboard-stats').should('not.have.descendants', 'json-dump');
    });

    it('should contain leaderboard data for Dev, Some Filters, Multiple Devices', () => {
      selectLeaderboardEnvironment('Dev');
      clickFliters(['Laptime', 'A Car Class']);
      enterLeaderboardName(devLeaderboardToSearch);
      clickDeviceTypes(['Steam', 'Windows Store']);
      pressSearch();
      cy.contains('mat-card-subtitle', devLeaderboardToSearch).should('exist');
      cy.get('leaderboard-stats').should('not.have.descendants', 'json-dump');
    });
  });
});
