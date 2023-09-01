import { randomTodoItemTitle } from 'cypress/utilities';

describe('My First Test', () => {
  it('should open initial project page', () => {
    cy.visit('/');
    cy.contains('Todo Manager App');
  });
  it('should create todo item', () => {
    cy.visit('/');
    const title = randomTodoItemTitle();
    cy.get('app-todo-create-form input[placeholder="Title"]').type(title);
    cy.intercept({
      method: 'POST',
      url: /\/api\/CreateTodoItem/,
    }).as('createTodoItem');
    cy.get('[data-test-id="create-new-todo-item-button"]').click();
    cy.wait('@createTodoItem');
    cy.get('#existing-todo-item-title').should('have.value', title);
  });
  it('should update todo item', () => {
    cy.visit('/');
    const title = randomTodoItemTitle();
    cy.get('#new-todo-item-title').type(title);
    cy.intercept({
      method: 'POST',
      url: /\/api\/CreateTodoItem/,
    }).as('createTodoItem');
    cy.get('[data-test-id="create-new-todo-item-button"]').click();
    cy.wait('@createTodoItem');
    const titleInput = cy.get('#existing-todo-item-title');
    titleInput.should('have.value', title);
    const title2 = randomTodoItemTitle();
    cy.intercept({
      method: 'PUT',
      url: /\/api\/UpdateTodoItem/,
    }).as('updateTodoItem');
    titleInput.clear().type(title2).blur();
    cy.wait('@updateTodoItem');
    titleInput.should('have.value', title2);
    titleInput.should('not.have.value', title);
  });
});
