import { login } from '@support/steward/auth/login';
import { RetailUsers } from '@support/steward/common/account-info';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';
import { changeEndpoint } from '@support/steward/shared-functions/change-endpoint';
import { searchByGtag, searchByXuid } from '@support/steward/shared-functions/searching';
import { stewardUrls } from '@support/steward/urls';
import { Tag, withTags } from '@support/tags';

//These values may change as tools and games are added or removed from Steward
const filterValues = {
  allTools: '33',
  specificTool: '1',
  playerFilter: '7',
  fh5Filter: '23',
  playerFM7Filter: '5',
};

context('Steward Index', withTags(Tag.UnitTestStyle), () => {
  beforeEach(() => {
    login();

    cy.visit('/');
  });

  it('should lead to Tools homepage', () => {
    // Verfiy cards
    cy.get('.mat-card-title').contains('Player Details');
    cy.get('.mat-card-title').contains('UGC Search');
    cy.get('.mat-card-title').contains('UGC Details');

    // Verify icons
    cy.get('.mat-icon').contains('notifications');
    cy.get('.mat-icon').contains('sticky_note_2');
    cy.get('.mat-icon').contains('account_circle');
    cy.get('.mat-icon').contains('contact_support');
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
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click().type('Player Details{enter}');
      });

      waitForProgressSpinners();
      cy.get('.mat-card-title').contains('Player Details');
      cy.get('mat-chip').contains(filterValues.specificTool).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools by input', () => {
      waitForProgressSpinners();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click().type('Player{enter}');
      });

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.playerFilter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools by title', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click();
      });
      const $optionList = cy.get('mat-option');
      $optionList.within(() => {
        const $option = cy.get('span').contains('FH5');
        $option.click();
      });

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.fh5Filter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should filter tools with multiple filters', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click().type('Player{enter}');
        $inputChipList.click();
      });
      const $optionList = cy.get('mat-option');
      $optionList.within(() => {
        const $option = cy.get('span').contains('FM7');
        $option.click();
      });

      waitForProgressSpinners();
      cy.get('mat-chip').contains(filterValues.playerFM7Filter).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('exist');
    });

    it('should reset when filters are removed', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      const $chipList = cy.get('mat-chip-list');
      $chipList.within(() => {
        const $inputChipList = cy.get('input');
        $inputChipList.click().type('Player{enter}');
        $inputChipList.click();
      });
      const $optionList = cy.get('mat-option');
      $optionList.within(() => {
        const $option = cy.get('span').contains('FM7');
        $option.click();
      });

      waitForProgressSpinners();
      cy.contains('mat-icon', 'close').click();
      cy.get('mat-chip').contains(filterValues.allTools).should('exist');
      cy.get('span').contains('Tools below do not match filters').should('not.exist');
    });
  });

  context('Nav Bar', () => {
    it('should set Standard Tools', () => {
      waitForProgressSpinners();
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

    it('should swap between dark mode, light mode, and match system', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      cy.get('button').contains('span', 'Click to set standard tools').click();

      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parent()
        .parent()
        .get('[aria-pressed="true"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'dark_mode').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parent()
        .parent()
        .get('[aria-pressed="true"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'light_mode').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parent()
        .parent()
        .get('[aria-pressed="true"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');

      cy.get('button').contains('mat-icon', 'devices').click();
      cy.get('button')
        .contains('mat-icon', 'light_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'dark_mode')
        .parent()
        .parent()
        .get('[aria-pressed="false"]')
        .should('exist');
      cy.get('button')
        .contains('mat-icon', 'devices')
        .parent()
        .parent()
        .get('[aria-pressed="true"]')
        .should('exist');
    });

    it('should add tools to the nav bar', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      const $matCardList = cy.get('mat-card');
      $matCardList.within(() => {
        //get the mat-card for Player Details
        const $playerDetailsCard = cy
          .contains('mat-card-title', 'Player Details')
          .parent()
          .parent()
          .parent();
        $playerDetailsCard.within(() => {
          cy.get('mat-card-actions').within(() => {
            cy.get('mat-checkbox').click();
          });
        });

        //get the mat-card for Gifting
        const $giftingCard = cy.contains('mat-card-title', 'Gifting').parent().parent().parent();
        $giftingCard.within(() => {
          cy.get('mat-card-actions').within(() => {
            cy.get('mat-checkbox').click();
          });
        });

        //get the mat-card for Car Details
        const $carDetailsCard = cy
          .contains('mat-card-title', 'Car Details')
          .parent()
          .parent()
          .parent();
        $carDetailsCard.within(() => {
          cy.get('mat-card-actions').within(() => {
            cy.get('mat-checkbox').click();
          });
        });
      });

      cy.get('mat-toolbar').within(() => {
        cy.get('a').contains('span', 'Player Details').should('exist');
        cy.get('a').contains('span', 'Gifting').should('exist');
        cy.get('a').contains('span', 'Car Details').should('exist');
      });
    });

    it('should reset nav bar when pressing the reset selection button', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      cy.get('mat-toolbar').within(() => {
        cy.get('button').contains('span', 'Click to set standard tools').click();
        cy.get('button').contains('span', 'Click to set standard tools').should('not.exist');
      });

      cy.get('button').contains('span', 'Reset Selection').click();

      cy.get('mat-toolbar').within(() => {
        cy.get('button').contains('span', 'Click to set standard tools').should('exist');
      });
    });

    // Known failure currently, bug made to address later (drag and drop issues)
    it('should reorder nav bar', withTags(Tag.Broken), () => {
      waitForProgressSpinners();
      cy.get('mat-toolbar').within(() => {
        cy.get('button').contains('span', 'Click to set standard tools').click();

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
    it('should change Woodstock endpoint from Retail to Studio and confirm the change in Player Details by checking a Retail and Studio account', withTags(Tag.Broken), () => {
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
