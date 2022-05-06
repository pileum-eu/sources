import { Given, When } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdPreferencesPage from '../pages/ud-preferences-page';

let udPreferencesPage: UdPreferencesPage;

Given(
  'je navigue directement vers la page gestion des accès du dashboard usager',
  function () {
    const { allAppsUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-preferences', baseUrl: allAppsUrl });
  },
);

Given(
  'je navigue vers la page gestion des accès du dashboard usager',
  function () {
    const { allAppsUrl, udRootUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-preferences', baseUrl: allAppsUrl });
    udPreferencesPage = new UdPreferencesPage(udRootUrl);
    udPreferencesPage.checkIsVisible();

    // TODO: Add a "loaded" classname on the IDP list in the user-dashboard
    // Wait for the response from ud-back API
    cy.wait('@UD:UserPreferences')
      .its('response.statusCode')
      .should('equal', 200);
    // No other way to wait for the IDP settings to load
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

Given(
  /^je suis (redirigé vers|sur) la page gestion des accès du dashboard usager$/,
  function () {
    const { udRootUrl }: Environment = this.env;
    udPreferencesPage = new UdPreferencesPage(udRootUrl);
    udPreferencesPage.checkIsVisible();

    // TODO: Add a "loaded" classname on the IDP list in the user-dashboard
    // Wait for the response from ud-back API
    cy.wait('@UD:UserPreferences')
      .its('response.statusCode')
      .should('equal', 200);
    // No other way to wait for the IDP settings to load
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) le fournisseur d'identité$/,
  function (text) {
    const isAuthorized = text === "d'autoriser";
    const { name } = this.identityProvider;
    const idpSetting = udPreferencesPage.getIdentityProviderSetting(name);
    idpSetting.setIdpAuthorization(isAuthorized);
  },
);

When(
  /^je décide (d'autoriser|de bloquer) les nouveaux fournisseurs d'identité par défaut$/,
  function (text) {
    if (text === "d'autoriser") {
      udPreferencesPage.blockFutureIdpCheckbox.uncheck();
    } else {
      udPreferencesPage.blockFutureIdpCheckbox.check();
    }
  },
);

When("j'enregistre mes réglages d'accès", function () {
  udPreferencesPage.saveButton.click();
  udPreferencesPage.checkIsUpdateNotificationDisplayed();
});