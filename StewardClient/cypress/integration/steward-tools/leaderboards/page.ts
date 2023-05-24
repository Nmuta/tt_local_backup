export function fillLeaderboardFieldsNoFilter(env: string, board: string): void {
  //setup valid leaderboard search
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).click();
}

export function fillLeaderboardFieldsNoFilterFakeBoard(env: string, board: string): void {
  //setup valid leaderboard search
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).should('not.exist');
}

export function fillLeaderboardFieldsOneFilter(env: string, filter: string, board: string): void {
  //setup valid leaderboard search
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  cy.contains('mat-option', filter).click();
  cy.get('body').click(); // Remove focus from select dropdown
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).click();
}

export function fillLeaderboardFieldsAllScoreTypeFilters(env: string, board: string): void {
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  clickAllScoreTypeFilters();
  cy.get('body').click(); // Remove focus from select dropdown
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).click();
}

export function fillLeaderboardFieldsAllCarClassFilters(env: string, board: string): void {
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  clickAllCarClassFilters();
  cy.get('body').click(); // Remove focus from select dropdown
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).click();
}

export function fillLeaderboardFieldsAllFilters(env: string, board: string): void {
  //setup valid leaderboard search
  cy.contains('mat-form-field', 'Leaderboard Environment').click();
  cy.contains('mat-option', env).click();
  cy.contains('mat-form-field', 'Leaderboard Filters').click();
  clickAllScoreTypeFilters();
  clickAllCarClassFilters();
  cy.get('body').click(); // Remove focus from select dropdown
  cy.contains('mat-form-field', 'Leaderboards').click().type(board);
  cy.contains('mat-option', board).click();
}

function clickAllScoreTypeFilters(): void {
  cy.contains('mat-option', 'Laptime').click();
  cy.contains('mat-option', 'XP').click();
  cy.contains('mat-option', 'SpeedTrap').click();
  cy.contains('mat-option', 'AverageSpeedZone').click();
  cy.contains('mat-option', 'PhotoCollection').click();
  cy.contains('mat-option', 'BarnFindDiscovery').click();
  cy.contains('mat-option', 'DiscountSignCollection').click();
  cy.contains('mat-option', 'RoadDiscovery').click();
  cy.contains('mat-option', 'RaceEncounter').click();
  cy.contains('mat-option', 'BucketListBiggerIsBetter').click();
  cy.contains('mat-option', 'BucketListSmallerIsBetter').click();
  cy.contains('mat-option', 'SkillsCombo').click();
  cy.contains('mat-option', 'TotalEventTime').click();
  cy.contains('mat-option', 'DangerSign').click();
  cy.contains('mat-option', 'DriftZone').click();
  cy.contains('mat-option', 'FreeRoamPoints').click();
  cy.contains('mat-option', 'PointsOfInterestDiscovered').click();
  cy.contains('mat-option', 'BeautySpotsDiscovered').click();
  cy.contains('mat-option', 'TrailblazerStunt').click();
}

function clickAllCarClassFilters(): void {
  cy.contains('mat-option', 'S2 Car Class').click();
  cy.contains('mat-option', 'S1 Car Class').click();
  cy.contains('mat-option', 'A Car Class').click();
  cy.contains('mat-option', 'B Car Class').click();
  cy.contains('mat-option', 'C Car Class').click();
  cy.contains('mat-option', 'D Car Class').click();
}

export function pressSearch(): void {
  cy.contains('button', 'Search Leaderboard')
    .should('not.have.class', 'mat-button-disabled')
    .click();
}
