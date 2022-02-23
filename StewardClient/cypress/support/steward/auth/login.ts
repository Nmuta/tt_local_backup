import env from '@support/env';

// Follow the instructions in /.cypress.env.json to configure this
export function login(): Cypress.Chainable<unknown> {
  return cy
    .request({
      method: 'POST',
      url: `https://login.microsoftonline.com/${env.tenantId}/oauth2/v2.0/token`,
      form: true,
      body: {
        grant_type: 'client_credentials',
        client_id: env.clientId,
        scope: `api://${env.clientId}/.default`,
        client_secret: env.clientSecret,
      },
    })
    .then(response => {
      // Set the valid access token to the user state.
      const token = response.body.access_token;
      const syncPath =
        `/auth/sync-state` + `?accessToken=${token}` + `&role=LiveOpsAdmin` + `&name=Application`;

      cy.visit(syncPath);
    });
}
