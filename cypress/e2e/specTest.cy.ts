describe("Home Page", () => {
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

    // Check search
    cy.get('[data-cy="search-box"]').should("be.visible");

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

  it("Cart functionlity: add item, remove item", () => {
    cy.get('[data-cy="productCard"]')
      .first()
      .should("exist")
      .find("button")
      .click();
    cy.get('[data-cy="cart-menu"]').should("have.class", "translate-x-full");

    // Open cart
    cy.get('[data-cy="open-cart-button"]').click();
    cy.get('[data-cy="cart-menu"]')
      .should("not.have.class", "translate-x-full")
      .and("be.visible");

    // Check everything is visible
    cy.get('[data-cy="subtotal"]').should("be.visible");

    // Check that cart item was added
    // TODO: check that title of cart item is the same as the product we added.
    cy.get('[data-cy="cart-item"]').should("have.length", 1);

    // Increase quantity and decrease:
    cy.get('[data-cy="increase-quantity"]').click();
    cy.get('[data-cy="quantity-label"]').should("have.text", "2");

    cy.get('[data-cy="decrease-quantity"]').click();
    cy.get('[data-cy="quantity-label"]').should("have.text", "1");

    // Get individual item price
    // Get cart item price
    let itemPrice: number;
    cy.get('[data-cy="cart-item"]')
      .first()
      .find("[data-cy='price-label']")
      .invoke("text")
      .then((text) => {
        itemPrice = parseFloat(text.replace("$", ""));
      });

    // Get subtotal (separate query)
    cy.get('[data-cy="subtotal"]')
      .invoke("text")
      .then((text) => {
        const subtotal = parseFloat(text.replace("$", ""));
        expect(subtotal).to.equal(itemPrice);
      });

    // Clear cart
    cy.get('[data-cy="clear-cart"]').click();

    // Close cart
    cy.get('[data-cy="close-cart-button"]').click();
    cy.get('[data-cy="cart-menu"]').should("have.class", "translate-x-full");
  });

  it("should search and navigate to product", () => {
    // 1. Verify search box visibility
    cy.get('[data-cy="search-box"]').should("be.visible").click(); // Sometimes needed to focus

    // 2. Type search query and wait for results
    const testQuery = "salad"; // Use a query that exists in your test data
    cy.get('[data-cy="search-box"] input').type(testQuery);

    // 4. Verify suggestions are visible and click first result
    cy.get('[data-cy="search-item"]').first().should("be.visible").click();

    // 5. Verify navigation to product page
    cy.url().should("include", "/products/");
  });
});
