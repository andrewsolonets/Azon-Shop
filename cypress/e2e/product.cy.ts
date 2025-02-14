describe("Product page", () => {
  beforeEach(() => {
    // Visit the site before each test
    cy.visit("/products/1");
  });

  it("Should add review", () => {
    cy.intercept("POST", "/api/sendReview", (req) => {
      // Get the raw request body
      const rawBody = req.body as Buffer;

      // Convert buffer to string
      const bodyString = rawBody?.toString();

      const headers = req.headers as Record<string, string | string[]>;

      // Extract boundary from headers
      const contentType = (headers?.["content-type"] as string) ?? "";
      const boundary = contentType.split("boundary=")[1];

      // Parse multipart data
      const parsedData = {} as Record<string, string>;
      bodyString?.split(`--${boundary}`).forEach((part) => {
        const match = /name="(.+?)"\r\n\r\n(.+?)\r\n/.exec(part);
        if (match) {
          if (match[1] && match[2]) {
            parsedData[match[1]] = match[2];
          }
        }
      });

      expect(parsedData).to.deep.include({
        username: "den",
        heading: "Great!",
        message: "Love the product",
        rating: "4",
        productId: "1",
      });

      req.reply({ statusCode: 201 });
    }).as("submitReview");
    cy.getDataCy("leave-review-btn").click();

    // Fill form
    cy.get("input[name=username]").type("den");
    cy.get("input[name=heading]").type("Great!");
    cy.get("textarea[name=message]").type("Love the product");

    // Interact with rating component - click 4th star
    cy.getDataCy("rating-container")
      .should("be.visible")
      .find('div[role="radio"].rr--box') // Target clickable star boxes
      .eq(3) // Zero-based index (0-4)
      .click({ force: true });

    cy.getDataCy("review-form").submit();

    // Wait for intercept and verify
    cy.wait("@submitReview");
  });
});
