describe('My First Test', () => {
  it('should open initial project page', () => {
    cy.visit('/');
    cy.contains('Todo Manager App');
  });
  it('should create todo item', () => {
    cy.visit('/');
    const randomTodoItemTitle = `Test Todo: ${Math.ceil(
      Math.random() * 100000000
    )}`;
    cy.get('app-todo-create-form input[placeholder="Title"]').type(
      randomTodoItemTitle
    );
    cy.intercept({
      method: 'POST',
      url: /\/api\/CreateTodoItem/,
    }).as('createTodoItem');
    cy.get('[data-test-id="create-new-todo-item-button"]').click();
    cy.wait('@createTodoItem');
    cy.get('#existing-todo-item-title').should(
      'have.value',
      randomTodoItemTitle
    );
  });
});
