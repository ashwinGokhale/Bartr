describe('Sprint 2 Front end testing', function () {

    /* User story 1: As a user, I would like to view a support/troubleshooting page, so I can attempt to solve my problem with the common
       issues and solutions provided or find contact information for additional help */
    it('User story 1: Check routing to the Support page from the footer', function () {

        /* Go to login page */
        cy.visit('localhost:3000/login')

        /* Login with email and password */
        cy.get('input.textBoxUserTest').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPassTest').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* go to support page from footer link */
        cy.get('a#supportLink.spacing').click()

        cy.url()
            .should('eq', 'http://localhost:3000/support')

    })

    it('User story 1: Check that the email link on the Support page is properly set to open the user\'s preffered email program', function () {

        /* Go to login page */
        cy.visit('localhost:3000/login')

        /* Login with email and password */
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* go to support page */
        cy.visit('http://localhost:3000/support')

        /* allow page time to load content */
        cy.wait(2000)

        /* ensure link is set to open mailing client */
        cy.get('a[href="mailto:BartrTradeHelp@gmail.com').first().contains('BartrTradeHelp@gmail.com')

    })

    it('User story 1: Check routing to the About Us page from the footer', function () {

        /* Go to login page */
        cy.visit('localhost:3000/login')

        /* Login with email and password */
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* go to About Us page from footer link */
        cy.get('a#aboutLink.spacing').click()

        cy.url()
            .should('eq', 'http://localhost:3000/aboutUs')

    })

    it('User story 1: Check routing to the Terms of Use page from the footer', function () {

        /* Go to login page */
        cy.visit('localhost:3000/login')

        /* Login with email and password */
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* go to Terms of Use page from footer link */
        cy.get('a#termsLink.spacing').click()

        cy.url()
            .should('eq', 'http://localhost:3000/terms')

    })

    /* User story 2: As a user, I should be able to report another user so that I can alert of any users or listings that aren't appropriate */
    it('User story 2: Check that the report a user button opens a Google form tab', function () {
        
        /* Go to login page */
        cy.visit('localhost:3000/login')

        /* Login with email and password */
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* Go to account page */
        cy.visit('localhost:3000/account')

        /* Click report user button */
        cy.get('button.reportUser').click()

    })

    it('User story 2: Check that Google form takes input and submits', function () {

        /* Go to google form */
        //cy.visit('https://docs.google.com/forms/d/e/1FAIpQLScDEeZwyH-fQiDNSUggxKMZFNPm03H9cF3IaI5uwzR7MeECkA/viewform')

    })

    /* User story3: As a user, I would like to be able to send an email for support assistance, so I can obtain help with issues beyond a user's control */
    it('User story 3: Check that the button to open a user\'s preffered emailing program works', function () {

        /* Check Contact button in footer contains href to 'mailto' (not necessarly signed in) */
        cy.visit('localhost:3000')
        cy.get('a[href="mailto:BartrTradeHelp@gmail.com"]').contains('Contact')

        cy.wait(2000)

        /* Login with email and password */
        cy.visit('localhost:3000/login')
        cy.get('input.textBox').first().type('b.omalley95@yahoo.com')
        cy.get('input.textBoxPass').type('password')

        cy.get('button.signInButton').click();

        /* wait for home page to load */
        cy.wait(2000)

        /* Go to support page and look for contact link */
        cy.visit('localhost:3000/support')
        cy.wait(2000)
        cy.get('a[href="mailto:BartrTradeHelp@gmail.com').first().contains('BartrTradeHelp@gmail.com')

    })

})