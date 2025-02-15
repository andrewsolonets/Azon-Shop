import { defineConfig } from "cypress";
import { clerkSetup } from "@clerk/testing/cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return clerkSetup({ config });
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
