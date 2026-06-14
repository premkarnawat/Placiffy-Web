const fs = require("fs");
const path = require("path");

const layoutPath = path.join(__dirname, "app/company/layout.tsx");
const content = fs.readFileSync(layoutPath, "utf8");
console.log("Layout exists");
