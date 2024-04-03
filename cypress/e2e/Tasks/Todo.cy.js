describe('TO-DO app', () => {
  const todo1Text = 'Primeira Tarefa';
  const todo2Text = 'Segunda Tarefa';
  const todo3Text = 'Treceira Tarefa';

  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/');
    cy.get('#todo_title').type(todo1Text);
    cy.get('.btn-primary').click();
    cy.get('#todo_title').type(todo2Text);
    cy.get('.btn-primary').click(); 
    cy.get('#todo_title').type(todo3Text);
    cy.get('.btn-primary').click();
  })
  it('Verifica se consegue impedir tarefas com títulos vazios', () => {
    cy.window().then(win => {
        cy.stub(win, 'alert').as('windowAlert');
    });
    cy.get('.btn-primary').click();
    cy.get('@windowAlert').should('have.been.calledWith', 'Digite um título para a tarefa!');
  });
  it('Varifica se existem Tarefas', () => {
    cy.get('tbody')
      .find('tr:not(.completed)')
      .should('have.length', 3)
      .should('contain', todo1Text)
      .should('contain', todo2Text)
      .should('contain', todo3Text);
  });
  it('Marca uma tarefa como Concluída', () => {
    cy.contains('td', todo1Text)
      .parent()
      .within(() => {
        cy.get('input[type="checkbox"]').check();
      });
    cy.contains('td', todo1Text)
      .parent()
      .should('have.class', 'completed');
  });
  context('Com uma tarefa Concluída o Cliente pode', () => {
    beforeEach(() => {
      cy.contains('td', todo1Text)
        .parent()
        .within(() => {
          cy.get('input[type="checkbox"]').check();
      });
    })

    it('filtrar tarefas incompletas', () => {
      cy.get('select').select('Em aberto');
      cy.get('tbody')
        .find('tr:not(.completed)')
        .should('have.length', 2)
        .should('contain', todo2Text)
        .should('contain', todo3Text);
    });

    it('filtrar por tarefas concluídas', () => {
      cy.get('select').select('Concluídos');
      cy.get('tbody')
        .find('tr.completed')
        .should('have.length', 1)
        .should('contain', todo1Text);
    });

    it('pode excluir uma tarefa concluída', () => {
      cy.get('.table tbody tr.completed input[type="checkbox"]').first().check();
      cy.get('.table tbody tr.completed button.btn-danger').first().click();
      cy.contains('Pay electric bill').should('not.exist');
    })
  })
})