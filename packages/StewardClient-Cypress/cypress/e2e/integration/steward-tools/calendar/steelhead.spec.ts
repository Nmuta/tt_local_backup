import { clickIfExists } from '@support/cypress/click-if-exists';
import { resetToDefaultState } from '@support/page-utility/reset-to-default-state';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { contextSearchByXuidForPlayerDetails, searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { stewardUrls } from '@support/steward/urls';
import { calendarTestBasicNavigation, calendarTestEventDetails, calendarTestFitlersEndstateOff, calendarTodaysEventsExist } from './page';

context('Steward / Tools / Calendar', () => {
  before(() => {
    resetToDefaultState();
    cy.visit(stewardUrls.tools.calendar.default);
  });

  context("Racer's Cup Calendar", () => {
    before(() => {
      cy.contains('[role="tab"]', "Racer's Cup Calendar").click();
      waitForProgressSpinners();
    });

    context('Gtag Lookup', () => {
      before(() => {
        searchByGtag(RetailUsers['chad'].gtag);
        cy.contains('button', 'Search').click();
        waitForProgressSpinners();
      });
      it('Should be able to search a user by Gtag, navigate the calendar, filter events, and click an event to see more event details', () => {
        calendarGeneralTesting();
      });
    })

    context('XUID Lookup', () =>{
      before(() => {
        clickIfExists('player-selection-single mat-chip mat-icon[matchipremove]');
        searchByXuid(RetailUsers['chad'].xuid);
        cy.contains('button', 'Search').click();
        waitForProgressSpinners();
      });
      it('Should be able to search a user by Xuid, navigate the calendar, filter events, and click an event to see more event details', () => {
        calendarGeneralTesting();
      });
    })
    
    context('Pegasus Environment Lookup', () => {
      before(()=>{
        cy.contains('[role="tab"]', 'Pegasus Selection').click();
        cy.contains('mat-form-field', 'Pegasus Environment').click().type('dev');
        cy.contains('button', 'Search').click();
        waitForProgressSpinners();
      })
      it('Should be able to search a pegasus environment, navigate the calendar, filter events, and click an eevent to see more event details', () => {
        calendarGeneralTesting();
      });
    })
  });
});

function calendarGeneralTesting(): void{
  calendarTodaysEventsExist();

  calendarTestBasicNavigation();

  calendarTestFitlersEndstateOff();

  // Open filter list
  cy.contains('button', 'Filter by Series and Playlist').click();

  // Enable the first series filter on the list
  cy.get('mat-tree').children().first().find('mat-checkbox').click();

  // Save the first series on the filter list as an alias and ensure it exists amongs today's events
  cy.get('mat-tree').children().first().find('.mat-checkbox-label').invoke('text').invoke('trim').as('firstSeries');
  cy.get('@firstSeries').then((firstSeries) => {
    cy.get('.cal-today').find('.mat-tooltip-trigger').should('contain', firstSeries);
  })

  // Close filter list
  cy.contains('button', 'Filter by Series and Playlist').click({force: true});

  // Click the event, check that it's the right event, and click one specific entry
  cy.get('@firstSeries').then((firstSeries) => {
    calendarTestEventDetails(firstSeries);
  })
}