import { NAV_LINKS } from "~/utils/constants";

describe("Header Structure", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays basic header structure", () => {
    cy.get("header").should("be.visible");
    cy.getDataCy("header-logo").should("contain", "Azon");
    cy.getDataCy("search-box").should("be.visible");
    cy.getDataCy("cart-button").should("be.visible");
  });
});

describe("Header Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  NAV_LINKS.forEach(({ text, href }) => {
    it(`navigates to ${text} page via "${text}" link`, () => {
      if (href === "/") {
        cy.visit("/categories");
      }
      // Find link by exact text within header navigation
      cy.get("header nav")
        .find("a")
        .contains(new RegExp(`^${text}$`, "i")) // Case-insensitive exact match
        .should("have.attr", "href", href)
        .click();

      // Verify navigation
      cy.location("pathname").should("eq", href);

      // Page-specific content checks
      switch (text) {
        case "Categories":
          cy.getDataCy("category-list").should("be.visible");
          break;
        case "All products":
          cy.getDataCy("product-grid").should("be.visible");
          break;
      }
    });
  });
});

describe("Home Page", () => {
  beforeEach(() => {
    // Visit the site before each test
    cy.visit("http://localhost:3000");
  });

  it("Cart functionlity: add item, remove item", () => {
    cy.get('[data-cy="productCard"]')
      .first()
      .should("exist")
      .find("button")
      .click();
    cy.getDataCy("cart-menu").should("have.class", "translate-x-full");

    // Open cart
    cy.getDataCy("cart-button").click();
    cy.getDataCy("cart-menu")
      .should("not.have.class", "translate-x-full")
      .and("be.visible");

    // Check everything is visible
    cy.getDataCy("subtotal").should("be.visible");

    // Check that cart item was added
    // TODO: check that title of cart item is the same as the product we added.
    cy.getDataCy("cart-item").should("have.length", 1);

    // Increase quantity and decrease:
    cy.getDataCy("increase-quantity").click();
    cy.getDataCy("quantity-label").should("have.text", "2");

    cy.getDataCy("decrease-quantity").click();
    cy.getDataCy("quantity-label").should("have.text", "1");

    // Get individual item price
    // Get cart item price
    let itemPrice: number;
    cy.getDataCy("cart-item")
      .first()
      .find("[data-cy='price-label']")
      .invoke("text")
      .then((text) => {
        itemPrice = parseFloat(text.replace("$", ""));
      });

    // Get subtotal (separate query)
    cy.getDataCy("subtotal")
      .invoke("text")
      .then((text) => {
        const subtotal = parseFloat(text.replace("$", ""));
        expect(subtotal).to.equal(itemPrice);
      });

    // Clear cart
    cy.getDataCy("clear-cart").click();

    // Close cart
    cy.getDataCy("close-cart-button").click();
    cy.getDataCy("cart-menu").should("have.class", "translate-x-full");
  });

  it("should have search working", () => {
    // 1. Verify search box visibility
    cy.getDataCy("search-box").should("be.visible").click(); // Sometimes needed to focus

    // 2. Type search query and wait for results
    const testQuery = "salad"; // Use a query that exists in your test data
    cy.get('[data-cy="search-box"] input').type(testQuery);
  });

  it("should open product page on card click", () => {
    cy.getDataCy("productCard")
      .first()
      .should("exist")
      .find("a")
      .first()
      .click();

    cy.url().should("include", "/products");
  });
});
