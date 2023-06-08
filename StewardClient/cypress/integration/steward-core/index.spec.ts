import { login } from '@support/steward/auth/login';
import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

//These values may change as tools and games are added or removed from Steward
const filterValues = {
  allTools: '34',
  specificTool: '1',
  playerFilter: '7',
  fh5Filter: '23',
  playerFM7Filter: '5',
};

context('Steward Index', () => {
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

    it('should filter tools by title', () => {
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

    it('should filter tools with multiple filters', () => {
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

    it('should reset when filters are removed', () => {
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

    it('should swap between dark mode, light mode, and match system', () => {
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

    it('should add tools to the nav bar', () => {
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

    it('should reset nav bar when pressing the reset selection button', () => {
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
    it('should reorder nav bar', () => {
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

        // 6 June, 2023
        // Does not display mouse interactions within tests, likely interacting behind the scenes (not visible in the test ui)
        // cy.get('#cdk-drop-list-0 > :nth-child(1)').then(el => {
        //   const $drag = el[0];
        //   cy.get('#cdk-drop-list-0 > :nth-child(2)').then(el => {
        //     const $drop = el[0];

        //     const coords = $drop.getBoundingClientRect()
        //     $drag.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        //     $drag.dispatchEvent(new MouseEvent('mousemove', {clientX: 200, clientY: 0}));
        //     $drag.dispatchEvent(new MouseEvent('mousemove', {
        //       clientX: coords.x+10,
        //       clientY: coords.y+10  // A few extra pixels to get the ordering right
        //     }));
        //     $drag.dispatchEvent(new MouseEvent('mouseup'));
        //   });
        // });

        // Uses cypress-real-events, can see mouse commands within tests, UI doesn't move with it
        // cy.get('a').contains('span', 'Player Details').parent().realMouseDown({button: 'left', position: 'center'})
        // .realMouseMove(100, 0, { position: 'center' }).realMouseUp();

        // Original attempt, can see mouse commands within tests, UI doesn't move with it
        // cy.get('a').contains('span', 'Player Details').parent()
        // .trigger('mousedown', { button: 0 })
        // .trigger('mousemove', 200, 0, { force: true })
        // .trigger('mouseup', 200, 0, { force: true });

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
});
