import { login } from '@support/steward/auth/login';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { stewardUrls } from '@support/steward/urls';
import { Tag, withTags } from '@support/tags';

//These values may change as tools and games are added or removed from Steward
const filterValues = {
  allTools: '35',
  specificTool: '1',
  playerFilter: '7',
  fh5Filter: '24',
  playerFM7Filter: '5',
};

context('Steward Index', () => {
  before(() => {
    login();

    cy.visit('/');
  });

  it('should lead to Tools homepage and close the tutorial', () => {
    // Verfiy cards
    cy.get('.mat-card-title').contains('Player Details');
    cy.get('.mat-card-title').contains('UGC Search');
    cy.get('.mat-card-title').contains('UGC Details');

    // Verify icons
    cy.get('.mat-icon').contains('notifications');
    cy.get('.mat-icon').contains('sticky_note_2');
    cy.get('.mat-icon').contains('account_circle');
    cy.get('.mat-icon').contains('contact_support');

    cy.get('mat-card').contains('mat-icon', 'close').click();
  });

  context('External Tools', () => {
    it('should confirm Zendesk tool exists', () => {
      cy.get('.mat-card-title').contains('Zendesk').should('exist');
    });

    it('should confirm Sprinklr tool exists', () => {
      cy.get('.mat-card-title').contains('Sprinklr').should('exist');
    });

    it('should confirm Pegasus tool exists', () => {
      cy.get('.mat-card-title').contains('Pegasus').should('exist');
    });

    it('should confirm Admin Pages tool exists', () => {
      cy.get('.mat-card-title').contains('Admin Pages').should('exist');
    });

    it('should confirm Power BI tool exists', () => {
      cy.get('.mat-card-title').contains('Power BI').should('exist');
    });
  });

  context('Search and Filters', () => {
    it('should search for a specific tool', () => {
      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.type('Player Details{enter}');
      });

      waitForProgressSpinners();
      cy.get('.mat-card-title').contains('Player Details');
      cy.get('mat-chip').contains(filterValues.specificTool).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools by input', () => {
      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.type('Player{enter}');
      });

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.playerFilter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools by title', () => {
      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click();
      });
      cy.get('mat-option').contains('span', 'FH5').click();

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.fh5Filter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools with multiple filters', () => {
      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.type('Player{enter}');
        $inputChipList.click();
      });
      cy.get('mat-option').contains('span', 'FM7').click();

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.playerFM7Filter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
      cy.contains('mat-icon', 'close').click();
    });
  });

  context('Nav Bar', () => {
    it('should reset nav bar when pressing the reset selection button', () => {
      cy.contains('mat-icon', 'close').click();
      cy.get('button').contains('span', 'Reset Selection').click();

      cy.get('mat-toolbar').within(() => {
        cy.get('button').contains('span', 'Click to set standard tools').should('exist');
      });
    });

    it('should set Standard Tools', () => {
      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      cy.get('mat-toolbar').within(() => {
        cy.get('button').contains('span', 'Click to set standard tools').click();

        cy.get('a').contains('Player Details').should('exist');
        cy.get('a').contains('Gifting').should('exist');
        cy.get('a').contains('Messaging').should('exist');
        cy.get('button').contains('span', 'Current Endpoints').should('exist');
        cy.get('button').contains('mat-icon', 'light_mode').should('exist');
        cy.get('button').contains('mat-icon', 'dark_mode').should('exist');
        cy.get('button').contains('mat-icon', 'devices').should('exist');
      });
    });

    it('should swap between dark mode, light mode, and match system', () => {
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parents('button')
        .get('[aria-pressed="true"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'dark_mode').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parents('button')
        .get('[aria-pressed="true"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'light_mode').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parents('button')
        .get('[aria-pressed="true"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'devices').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parents('button')
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parents('button')
        .get('[aria-pressed="true"]')
        .should('exist');
    });

    it('should add tools to the nav bar', () => {
      waitForProgressSpinners();
      cy.get('button').contains('span', 'Reset Selection').click();

      const $playerDetailsCard = cy
        .contains('mat-card-title', 'Player Details')
        .parents('mat-card');
      $playerDetailsCard.within(() => {
        cy.get('mat-card-actions').within(() => {
          cy.get('input').check({ force: true });
        });
      });

      const $giftingCard = cy.contains('mat-card-title', 'Gifting').parents('mat-card');
      $giftingCard.within(() => {
        cy.get('mat-card-actions').within(() => {
          cy.get('input').check({ force: true });
        });
      });

      const $carDetailsCard = cy.contains('mat-card-title', 'Car Details').parents('mat-card');
      $carDetailsCard.within(() => {
        cy.get('mat-card-actions').within(() => {
          cy.get('input').check({ force: true });
        });
      });

      cy.get('mat-toolbar').within(() => {
        cy.get('a').contains('span', 'Player Details').should('exist');
        cy.get('a').contains('span', 'Gifting').should('exist');
        cy.get('a').contains('span', 'Car Details').should('exist');
      });

      cy.get('button').contains('span', 'Reset Selection').click();
    });

    // Known failure currently, bug made to address later (drag and drop issues)
    it('should reorder nav bar', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      cy.get('button').contains('span', 'Click to set standard tools').click();

      cy.get('mat-toolbar').within(() => {
        cy.get('div')
          .contains('a')
          .first()
          .within(() => {
            cy.get('span').contains('Player Details').should('exist');
          });

        cy.get('button').contains('mat-icon', 'edit').click();

        //insert functional Drag and Drop logic here

        cy.get('div')
          .contains('a')
          .first()
          .within(() => {
            cy.get('span').contains('Gifting').should('exist');
          });
        cy.get('a').contains('span', 'Player Details').should('exist');

        cy.get('button').contains('mat-icon', 'edit').click();
      });
    });
  });

  context('Endpoints', () => {
    it('should change Woodstock endpoint from Retail to Studio and confirm the change in Player Details by checking a Retail and Studio account', () => {
      changeEndpoint('Woodstock', 'Retail', 'Studio');
      cy.visit(stewardUrls.tools.playerDetails.woodstock);
      cy.get('a').contains('span', 'FH5').contains('span', 'Studio').should('exist');
      searchByGtag(RetailUsers['chad'].gtag);
      cy.contains('h2', 'Request failed').should('exist');
      cy.get('mat-chip').contains('mat-icon', 'cancel').click();
      searchByXuid('2814649032001718');
      cy.get('player-identity-results').contains('span', '2814649032001718').should('exist');
    });
  });
});
