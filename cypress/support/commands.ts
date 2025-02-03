/// <reference types="cypress" />

import { useCartActions } from "~/hooks/useCartActions";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>;
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>;
//       dismiss(
//         subject: string,
//         options?: Partial<TypeOptions>,
//       ): Chainable<Element>;
//       visit(
//         originalFn: CommandOriginalFn,
//         url: string,
//         options: Partial<VisitOptions>,
//       ): Chainable<Element>;
//     }
//   }
// }

export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- auto-added by Cypress, keep as is for now
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      getDataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("getDataCy", (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});
