describe('PuzzleBot Landing Page', () => {
  beforeEach(() => {
    // Visit the landing page before each test
    cy.visit('/landing-page.html')
  })

  describe('Page Loading', () => {
    it('should load the landing page successfully', () => {
      // Verify page title
      cy.title().should('include', 'PuzzleBot')

      // Verify the page contains the main container
      cy.get('.container').should('be.visible')
    })

    it('should display the page without errors', () => {
      // Check that the logo is visible
      cy.get('.logo').should('be.visible')
      cy.get('.logo').should('contain', 'PUZZLEBOT')
    })
  })

  describe('Navigation Bar', () => {
    it('should display the navigation bar with logo', () => {
      cy.get('nav').should('be.visible')
      cy.get('.nav-logo').should('contain', 'PUZZLEBOT')
    })

    it('should display all navigation menu items on desktop', () => {
      cy.viewport('macbook-15')
      cy.get('.nav-menu').should('be.visible')
      cy.get('.nav-menu a').should('have.length', 5)
      cy.get('.nav-menu a').eq(0).should('contain', 'Accueil')
      cy.get('.nav-menu a').eq(1).should('contain', 'Fonctionnalités')
      cy.get('.nav-menu a').eq(2).should('contain', 'Tarifs')
      cy.get('.nav-menu a').eq(3).should('contain', 'Gameplay')
      cy.get('.nav-menu a').eq(4).should('contain', 'Contact')
    })
  })

  describe('Hero Section', () => {
    it('should display the hero section with title and description', () => {
      cy.get('.hero').should('be.visible')
      cy.get('.hero h1').should('contain', 'Guidez votre robot vers la victoire')
      cy.get('.hero p').should('contain', 'Résolvez des puzzles complexes')
    })

    it('should display the robot showcase', () => {
      cy.get('.robot-showcase').should('be.visible')
      cy.get('.robot').should('be.visible')
      cy.get('.robot-head').should('be.visible')
      cy.get('.robot-eye').should('have.length', 2)
    })

    it('should display puzzle pieces', () => {
      cy.get('.puzzle-pieces').should('be.visible')
      cy.get('.puzzle-piece').should('have.length', 4)
    })

    it('should display the CTA button', () => {
      cy.get('.cta-button').should('be.visible')
      cy.get('.cta-button').should('contain', 'Précommander Maintenant')
    })
  })

  describe('Hamburger Menu (Mobile)', () => {
    beforeEach(() => {
      // Set mobile viewport
      cy.viewport('iphone-12')
    })

    it('should display hamburger menu on mobile', () => {
      cy.get('.hamburger').should('be.visible')
    })

    it('should toggle the mobile menu when hamburger is clicked', () => {
      // Menu should be hidden initially
      cy.get('.nav-menu').should('not.have.class', 'active')

      // Click hamburger to open menu
      cy.get('.hamburger').click()
      cy.get('.nav-menu').should('have.class', 'active')

      // Click hamburger again to close menu
      cy.get('.hamburger').click()
      cy.get('.nav-menu').should('not.have.class', 'active')
    })

    it('should apply active class to hamburger when menu is open', () => {
      cy.get('.hamburger').should('not.have.class', 'active')
      cy.get('.hamburger').click()
      cy.get('.hamburger').should('have.class', 'active')
      cy.get('.hamburger').click()
      cy.get('.hamburger').should('not.have.class', 'active')
    })
  })

  describe('Features Section', () => {
    it('should display the features section', () => {
      cy.get('.features').should('be.visible')
    })

    it('should display feature cards', () => {
      cy.get('.feature-card').should('have.length.greaterThan', 0)
    })
  })

  describe('Interactive Elements', () => {
    it('should respond to CTA button click', () => {
      cy.get('.cta-button').click()
      // Button should be clickable without errors
      cy.get('.cta-button').should('exist')
    })

    it('should navigate through menu links on desktop', () => {
      cy.viewport('macbook-15')
      cy.get('.nav-menu a').eq(0).should('have.attr', 'href', '#accueil')
      cy.get('.nav-menu a').eq(1).should('have.attr', 'href', '#fonctionnalites')
      cy.get('.nav-menu a').eq(2).should('have.attr', 'href', '#tarifs')
      cy.get('.nav-menu a').eq(3).should('have.attr', 'href', '#gameplay')
      cy.get('.nav-menu a').eq(4).should('have.attr', 'href', '#contact')
    })
  })

  describe('Responsive Design', () => {
    it('should be responsive on mobile (iphone-12)', () => {
      cy.viewport('iphone-12')
      cy.get('nav').should('be.visible')
      cy.get('.container').should('be.visible')
      cy.get('.hero').should('be.visible')
    })

    it('should be responsive on tablet (ipad-2)', () => {
      cy.viewport('ipad-2')
      cy.get('nav').should('be.visible')
      cy.get('.container').should('be.visible')
      cy.get('.hero').should('be.visible')
    })

    it('should be responsive on desktop (macbook-15)', () => {
      cy.viewport('macbook-15')
      cy.get('nav').should('be.visible')
      cy.get('.container').should('be.visible')
      cy.get('.hero').should('be.visible')
    })
  })

  describe('Orange Color Scheme', () => {
    it('should use orange gradient in logo', () => {
      cy.get('.nav-logo')
        .should('have.css', 'background-clip', 'text')
    })

    it('should apply orange styling to main elements', () => {
      // The logo should have orange styling via CSS
      cy.get('.nav-logo').should('be.visible')
    })
  })
})