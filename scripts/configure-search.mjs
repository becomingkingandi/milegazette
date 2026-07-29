import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}
const gaId = args.get("--ga");
const verification = args.get("--search-console");

if (!gaId && !verification) {
  console.error("Usage: node scripts/configure-search.mjs [--ga G-XXXXXXXXXX] [--search-console TOKEN]");
  process.exit(1);
}
if (gaId && !/^G-[A-Z0-9]+$/i.test(gaId)) {
  console.error("The GA4 measurement ID must begin with G-.");
  process.exit(1);
}

const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "graphify-out", "node_modules"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
}
walk(root);

for (const file of files) {
  let html = fs.readFileSync(file, "utf8");
  if (gaId) {
    html = html.replace(/\s*<!-- GA4 START -->[\s\S]*?<!-- GA4 END -->\s*/i, "\n");
    const snippet = `  <!-- GA4 START -->\n  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${gaId}");</script>\n  <!-- GA4 END -->\n`;
    html = html.replace("</head>", `${snippet}</head>`);
  }
  if (verification && path.relative(root, file) === "index.html") {
    html = html.replace(/\s*<meta[^>]+name=["']google-site-verification["'][^>]*>\s*/i, "\n");
    html = html.replace("</head>", `  <meta name="google-site-verification" content="${verification.replaceAll('"', "&quot;")}">\n</head>`);
  }
  fs.writeFileSync(file, html);
}

console.log(`Configured${gaId ? " GA4" : ""}${gaId && verification ? " and" : ""}${verification ? " Search Console verification" : ""}.`);
