import "dotenv/config";

import { createExpressApp } from "./app.js";
import { DependencyProvider } from "./dependencyProvider.js";

const port = process.env.PORT || 3000;

// Dependency Injection via provider
const dependencies = new DependencyProvider();

// Create Express app
const app = createExpressApp(
  dependencies.checkDatabaseConnectionUseCase,
  dependencies.checkDataAvailabilityUseCase
);

// Start the server
app.listen(port, () => {
  console.log(`Health Check API running on port ${port}`);
});
