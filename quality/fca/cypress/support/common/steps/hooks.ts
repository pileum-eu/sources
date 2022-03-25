import { Before } from 'cypress-cucumber-preprocessor/steps';

import {
  addFCBasicAuthorization,
  clearAllCookies,
  forceSameSiteNone,
  getDefaultIdentityProvider,
  getDefaultServiceProvider,
  getDefaultUser,
  isUsingFCBasicAuthorization,
} from '../helpers';
import {
  Environment,
  IdentityProvider,
  ServiceProvider,
  UserData,
} from '../types';

const skipTest = (): void => {
  /**
   * @todo: Use the plug-in cypress-skip-test once migrated to Cypress 8
   * @author: Nicolas Legeay
   * @link https://github.com/cypress-io/cypress-skip-test
   * date: 18/08/2021
   */
  // @ts-expect-error "cy.state" is not in the "cy" type
  cy.state('runnable').ctx.skip();
};

const setFixtureContext = (
  fixture: string,
  pathArray: string[],
  contextName: string,
): void => {
  cy.task('getFixturePath', { fixture, pathArray }).then(
    (fixturePath: string) => {
      cy.log(fixturePath);
      cy.fixture(fixturePath).as(contextName);
    },
  );
};

beforeEach(function () {
  // Load environment config and test data
  const platform: string = Cypress.env('PLATFORM');
  const testEnv: string = Cypress.env('TEST_ENV');
  const pathArray = [platform, testEnv];
  setFixtureContext('environment.json', pathArray, 'env');
  setFixtureContext('service-providers.json', pathArray, 'serviceProviders');
  setFixtureContext('identity-providers.json', pathArray, 'identityProviders');
  setFixtureContext('scopes.json', pathArray, 'scopes');
  setFixtureContext('users.json', pathArray, 'users');

  // Define default data
  cy.get<ServiceProvider[]>('@serviceProviders').then((serviceProviders) => {
    getDefaultServiceProvider(serviceProviders);
  });
  cy.get<IdentityProvider[]>('@identityProviders').then((identityProviders) => {
    getDefaultIdentityProvider(identityProviders);
  });
  cy.get<UserData[]>('@users').then((users) => {
    getDefaultUser(users);
  });

  // Setup interceptions to add basic authorization header on FC requests
  if (isUsingFCBasicAuthorization()) {
    addFCBasicAuthorization();
  }

  if (testEnv === 'integ01') {
    // Avoid cookies side-effect by clearing cookies on all domains
    clearAllCookies();

    // Setup interceptions to override set-cookie samesite values
    const crossDomains = {
      AC: 'dev-agentconnect.fr',
      Osmose: 'bacasable-prep-osmose.jaliosagora.com',
    };
    forceSameSiteNone(crossDomains);
  }
});

/**
 * @todo Need refactor to handle increasing number of context variables
 * author: Nicolas
 * date: 18/05/2021
 */
afterEach(function () {
  // Delete the Context variable changed during the scenario
  delete this.requestedScope;
  delete this.serviceProvider;
  delete this.identityProvider;
  delete this.user;
  delete this.operatorUser;
});

Before({ tags: '@ignoreDocker' }, function () {
  if (['docker', 'recette'].includes(Cypress.env('TEST_ENV'))) {
    skipTest();
  }
});

Before({ tags: '@ignoreInteg01' }, function () {
  if (Cypress.env('TEST_ENV') === 'integ01') {
    skipTest();
  }
});

Before({ tags: '@validationVisuelle' }, function () {
  // Clear the localstorage before each visual test
  // @link: https://github.com/cypress-io/cypress/issues/2573
  cy.get<Environment>('@env').then((env) => {
    cy.visit(env.fcaRootUrl, { failOnStatusCode: false }).then((win) => {
      win.localStorage.clear();
    });
  });
});
