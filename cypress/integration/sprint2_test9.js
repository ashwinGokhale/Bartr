describe('User story 9: Test the settings page', function () {

    it('Test changing the display name', function () {

        /* Go to login page */
        cy.visit('localhost:3000/login')
        cy.wait(2000)

        /* Login with email and password */
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(3000)

        /* go to settings page */
        cy.visit('localhost:3000/settings')
        cy.wait(3000)

        /* change display name */
        cy.get('input#displayName.align').clear()
        cy.get('input#displayName.align').type('TESTING 123')

        /* click update button */
        cy.get('input.submit').click();

        /* wait for update to complete */
        cy.wait(5000)

        /* check display name on home page */
        cy.visit('localhost:3000/home')
        cy.wait(5000)

        cy.get('h5.userName').contains('TESTING 123')

        /* check display name input on settings page */
        cy.visit('localhost:3000/settings')
        cy.wait(5000)

        cy.get('div.columnRight').contains('TESTING')

    })

})