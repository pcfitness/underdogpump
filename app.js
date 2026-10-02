// cPanel "Setup Node.js App" startup file.
// Application startup file: app.js
// The built server listens on the PORT cPanel sets.
process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

import("./.output/server/index.mjs").catch((err) => {
  console.error(err);
  process.exit(1);
});
