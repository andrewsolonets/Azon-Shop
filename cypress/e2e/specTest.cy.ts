describe("test", () => {
  beforeEach(() => {
    // Visit the site before each test
    cy.visit("http://localhost:3000");
  });

  it("displays the header with all menu options", () => {
    // Check that the header exists
    cy.get("header").should("be.visible");

    // Check the logo
    cy.get("header h3")
      .should("have.text", "Azon")
      .and("have.class", "text-2xl");

    // Check individual menu items and their links
    cy.get("header nav ul li")
      .eq(0)
      .find("a")
      .should("have.text", "Home")
      .and("have.attr", "href", "/");
    cy.get("header nav ul li")
      .eq(1)
      .find("a")
      .should("have.text", "Categories")
      .and("have.attr", "href", "/categories");
    cy.get("header nav ul li")
      .eq(2)
      .find("a")
      .should("have.text", "All products")
      .and("have.attr", "href", "/products");

    // Check the search bar
    cy.get("header .aa-Autocomplete").should("exist");

    // Check the cart button
    cy.get("header button[aria-label='Open Cart']").should("be.visible");

    // Check the profile button
    // cy.get("header a[href='/profile']").should("exist");
  });

  it("adds product to cart", () => {
    cy.get('[data-cy="productCard"]')
      .first()
      .should("exist")
      .find("button")
      .click();
  });
});
