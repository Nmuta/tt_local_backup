import { waitForProgressSpinners } from '@support/steward/common/wait-for-progress-spinners';

/** Interface for UGC data */
interface SampleUgc {
  id: string;
  time: string;
}

/** UGC data for Woodstock */
export const woodstockSamples: Record<string, SampleUgc> = {
  livery: {
    id: 'c5329e63-3c1f-4d60-b251-9e69cb2aeda7',
    time: '11/9/21 5:48:05 PM',
  },

  layerGroup: {
    id: '307916c9-e492-4b57-af6e-815bb5e068f9',
    time: '2/8/22 11:40:02 AM',
  },

  photo: {
    id: '12555e32-9e02-452b-b4ee-a1886c5a40a2',
    time: '2/8/22 3:13:50 PM',
  },

  tune: {
    id: '27f5873f-de88-406d-829e-9eb8658cd511',
    time: '2/8/22 3:16:11 PM',
  },
};

/** UGC Data for Sunrise */
export const sunriseSamples: Record<string, SampleUgc> = {
  livery: {
    id: '0f8d8e88-6ecb-43ab-b386-6b56c9889390',
    time: '3/15/21 8:30:02 AM',
  },
  photo: {
    id: 'cb276ca9-9e62-4493-bf21-5b1021de5098',
    time: '1/10/21 8:06:05 PM',
  },
  tune: {
    id: '513c0c47-150b-45ca-912e-39d6728f6f9b',
    time: '12/3/20 5:15:51 PM',
  },
  events: {
    id: '740b5d6a-5b10-44d1-882a-e647f42b910f',
    time: '10/11/18 5:51:25 PM',
  },
};

/** UGC Data for Steelhead */
export const steelheadSamples: Record<string, SampleUgc> = {
  livery: {
    id: 'df893754-f769-43b6-9ce6-9a458f8c6284',
    time: '8/15/23 3:54:15 AM',
  },
  tuneBlob: {
    id: 'fbce48ca-7df9-4e5a-9ce9-cc152b207e7f',
    time: '7/29/23 9:46:33 PM',
  },
  layerGroup: {
    id: '308bdfe0-f4cf-4163-9661-7b00e00fbe5f',
    time: '7/30/23 12:03:42 AM',
  },
};

/** Fills in ugcid and confirms population */
export function testInputUgcID(ugc: SampleUgc): void {
  cy.get('mat-form-field')
    .contains('mat-label', 'UGC ID / Share Code')
    .parents('mat-form-field')
    .click()
    .type('{selectall}{backspace}' + ugc.id);
  waitForProgressSpinners();

  cy.get('model-dump-simple-table').contains('div', ugc.id).should('exist');
  verifyUgcCreatedDate(ugc.time);
}

/** Verifies the correct date for a given ucgid */
function verifyUgcCreatedDate(createdDate: string): void {
  cy.contains('mat-card', 'UGC Timeline')
    .contains('tr', 'Created Date Utc')
    .contains('td', createdDate)
    .should('exist');
}
