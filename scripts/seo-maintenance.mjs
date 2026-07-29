import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const site = "https://milegazette.com";
const updated = "2026-07-28";
const updatedLabel = "July 28, 2026";

const evergreenCopies = [
  {
    from: "cards/best-travel-credit-cards-2024-detailed-comparison.html",
    to: "cards/best-travel-credit-cards/index.html",
    title: "Best Travel Credit Cards for Miles: Comparison Guide — Mile Gazette",
    h1: "Best Travel Credit Cards for Miles: A Practical Comparison",
    description: "Compare travel credit cards by annual fee, rewards, transfer partners and realistic value for different travel styles."
  },
  {
    from: "cards/best-travel-credit-cards-for-europe-2024.html",
    to: "cards/best-travel-credit-cards-for-europe/index.html",
    title: "Best Travel Credit Cards for Europe — Mile Gazette",
    h1: "Best Travel Credit Cards for Europe",
    description: "Compare travel cards for Europe by foreign transaction fees, acceptance, protections, rewards and transfer partners."
  },
  {
    from: "cards/best-travel-credit-cards-for-flights-2025.html",
    to: "cards/best-travel-credit-cards-for-flights/index.html",
    title: "Best Travel Credit Cards for Flights — Mile Gazette",
    h1: "Best Travel Credit Cards for Flights",
    description: "Compare cards for flight rewards, airport benefits and lounge access while weighing annual fees and restrictions."
  },
  {
    from: "guides/budapest-budget-travel-guide-2024.html",
    to: "guides/budapest-budget-travel-guide/index.html",
    title: "Budapest Budget Travel Guide — Mile Gazette",
    h1: "Budapest on a Budget: A Practical Travel Guide",
    description: "Plan a Budapest trip with practical guidance on neighborhoods, transit, affordable food and major attractions."
  },
  {
    from: "guides/budget-friendly-tokyo-guide-2025.html",
    to: "guides/budget-friendly-tokyo-guide/index.html",
    title: "Budget-Friendly Tokyo Travel Guide — Mile Gazette",
    h1: "Tokyo on a Budget: A Practical Travel Guide",
    description: "Plan an affordable Tokyo trip with practical guidance on transit, food, neighborhoods and free attractions."
  },
  {
    from: "guides/phuket-thailand-budget-travel-guide-2025.html",
    to: "guides/phuket-thailand-budget-travel-guide/index.html",
    title: "Phuket Budget Travel Guide — Mile Gazette",
    h1: "Phuket on a Budget: A Practical Travel Guide",
    description: "Plan an affordable Phuket trip with guidance on beaches, transportation, food and accommodation."
  },
  {
    from: "guides/tulum-on-a-budget-2025-guide.html",
    to: "guides/tulum-on-a-budget-guide/index.html",
    title: "Tulum Budget Travel Guide — Mile Gazette",
    h1: "Tulum on a Budget: A Practical Travel Guide",
    description: "Plan a Tulum trip with practical guidance on beaches, transportation, food and accommodation costs."
  },
  {
    from: "destinations/bangkok-street-food-guide-best-stalls-2024.html",
    to: "destinations/bangkok-street-food-guide/index.html",
    title: "Bangkok Street Food Guide — Mile Gazette",
    h1: "Bangkok Street Food: A Practical Guide",
    description: "Explore Bangkok street food with practical guidance on dishes, neighborhoods, pricing and food-safety considerations."
  },
  {
    from: "destinations/best-hostels-in-lisbon-portugal-2025.html",
    to: "destinations/best-hostels-in-lisbon/index.html",
    title: "Best Hostels in Lisbon: How to Choose — Mile Gazette",
    h1: "How to Choose a Hostel in Lisbon",
    description: "Compare Lisbon hostel neighborhoods, room types, transit access and booking considerations for a practical stay."
  },
  {
    from: "destinations/lisbon-portugal-weekend-guide-budget-tips.html",
    to: "destinations/lisbon-budget-travel-guide/index.html",
    title: "Lisbon Budget Travel Guide — Mile Gazette",
    h1: "Lisbon on a Budget: A Practical Travel Guide",
    description: "Plan an affordable Lisbon trip with guidance on neighborhoods, transit, food and major attractions."
  }
];

const redirectSources = new Set([
  "cards/best-travel-credit-cards-2024-detailed-comparison.html",
  "cards/best-travel-credit-cards-2024-for-mile-collectors.html",
  "cards/best-travel-credit-cards-2024-for-mileage-rewards.html",
  "cards/best-travel-credit-cards-2024-miles-points.html",
  "cards/best-travel-credit-cards-for-frequent-flyer-miles-2024.html",
  "cards/best-travel-credit-cards-for-mile-collectors-2024.html",
  "cards/best-travel-credit-cards-for-mileage-2024.html",
  "cards/best-travel-credit-cards-for-mileage-enthusiasts-2024.html",
  "cards/best-travel-credit-cards-for-miles-2024.html",
  "cards/best-travel-credit-cards-for-europe-2024.html",
  "cards/best-travel-credit-cards-for-flights-2025.html",
  "guides/budapest-budget-travel-guide-2024.html",
  "guides/budapest-on-a-budget-2025-tips-for-thrifty-travelers.html",
  "guides/budapest-on-a-budget-how-to-experience-the-city-for-under-60-a-day.html",
  "guides/budget-friendly-tokyo-guide-2025.html",
  "guides/phuket-thailand-budget-travel-guide-2025.html",
  "guides/tulum-on-a-budget-2025-guide.html",
  "destinations/bangkok-street-food-guide-best-stalls-2024.html",
  "destinations/best-hostels-in-lisbon-portugal-2025.html",
  "destinations/lisbon-portugal-three-day-itinerary-on-a-budget.html",
  "destinations/lisbon-portugal-weekend-guide-budget-tips.html",
  "destinations/lisbon-portugal-weekend-travel-guide-2024.html"
]);

function cleanRoute(relative) {
  const normalized = relative.split(path.sep).join("/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) return `/${normalized.slice(0, -"index.html".length)}`;
  return `/${normalized.slice(0, -".html".length)}/`;
}

function textOnly(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `${replacement}\n</head>`);
}

function setMetadata(html, { title, description, canonical, article }) {
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceTag(html, /<meta[^>]+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}">`);
  html = replaceTag(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  html = replaceTag(html, /<meta[^>]+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}">`);
  html = replaceTag(html, /<meta[^>]+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}">`);
  html = replaceTag(html, /<meta[^>]+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="${article ? "article" : "website"}">`);
  html = replaceTag(html, /<meta[^>]+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  html = replaceTag(html, /<meta[^>]+name=["']twitter:card["'][^>]*>/i, `<meta name="twitter:card" content="summary_large_image">`);
  if (!/src=["']\/site\.js["']/i.test(html)) html = html.replace("</head>", `  <script src="/site.js" defer></script>\n</head>`);
  return html;
}

function schemaFor({ canonical, title, description, section, article }) {
  const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: `${site}/` }];
  if (section) crumbs.push({ "@type": "ListItem", position: 2, name: section.name, item: `${site}${section.path}` });
  if (article) crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: title.replace(/ — Mile Gazette$/, ""), item: canonical });
  const graph = [
    { "@type": "Organization", "@id": `${site}/#organization`, name: "Mile Gazette", url: `${site}/` },
    {
      "@type": article ? "Article" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      headline: article ? title.replace(/ — Mile Gazette$/, "") : undefined,
      name: article ? undefined : title.replace(/ — Mile Gazette$/, ""),
      description,
      dateModified: updated,
      author: article ? { "@type": "Organization", name: "Mile Gazette Editorial Team" } : undefined,
      publisher: { "@id": `${site}/#organization` },
      mainEntityOfPage: article ? canonical : undefined
    },
    { "@type": "BreadcrumbList", itemListElement: crumbs }
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, (key, value) => value === undefined ? undefined : value);
}

function addTrust(html, isCards) {
  if (html.includes("article-trust")) return html;
  const trust = `<div class="article-trust"><p><strong>By the Mile Gazette Editorial Team</strong></p><p>Reviewed against our <a href="/methodology/">editorial methodology</a> · Updated ${updatedLabel}</p></div>`;
  html = html.replace(/(<div class=["']heroActions["']>[\s\S]*?<\/div>)/i, `$1\n${trust}`);
  if (isCards && !html.includes("affiliate-note")) {
    const note = `<aside class="affiliate-note"><strong>Editorial and affiliate disclosure</strong><p>Card terms change frequently. Verify current terms with the issuer. Mile Gazette may receive compensation from future approved partner links, but no partner link is active in this component. <a href="/affiliate-disclosure/">Learn more.</a></p><a class="button primary referral-button" data-referral-name="article-card-comparison" href="/cards/">Compare card categories</a></aside>`;
    html = html.replace(/<\/article>/i, `${note}\n</article>`);
  }
  return html;
}

for (const copy of evergreenCopies) {
  const destination = path.join(root, copy.to);
  if (fs.existsSync(destination)) continue;
  let html = fs.readFileSync(path.join(root, copy.from), "utf8");
  html = html.replace(/2024|2025/g, "").replace(/\s{2,}/g, " ");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${copy.title}</title>`);
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1>${copy.h1}</h1>`);
  html = html.replace(/<meta[^>]+name=["']description["'][^>]*>/i, `<meta name="description" content="${copy.description}">`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "graphify-out" || entry.name === "node_modules") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(root);

const audit = [];
const prototypeFiles = new Set(["article-detail.html", "card-comparison.html"]);
function removeUnsupportedExperience(html) {
  return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (whole, attributes, content) => {
    if (/<[^>]+>/.test(content)) return whole;
    const sentences = content.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    const kept = sentences.filter(sentence => !/\b(?:I|I've|I’ve|my|we tested|we spent|our editorial team spent)\b/i.test(sentence));
    const cleaned = kept.join(" ").replace(/\s+/g, " ").trim();
    if (cleaned) return `<p${attributes}>${cleaned}</p>`;
    if (/class=["'][^"']*lede/i.test(attributes)) {
      return `<p${attributes}>A practical planning framework; verify current prices, terms and availability before making a decision.</p>`;
    }
    return "";
  });
}
for (const file of htmlFiles) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  let html = fs.readFileSync(file, "utf8");
  if (prototypeFiles.has(relative) && !/name=["']robots["']/i.test(html)) {
    html = html.replace("</head>", `  <meta name="robots" content="noindex,follow">\n</head>`);
  }
  const noindex = /name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
  const redirected = redirectSources.has(relative);
  if (redirected) {
    audit.push({ file: relative, status: "redirected" });
    continue;
  }
  const h1 = textOnly((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [,"Mile Gazette"])[1]);
  const currentTitle = textOnly((html.match(/<title>([\s\S]*?)<\/title>/i) || [,`${h1} — Mile Gazette`])[1]);
  const currentDescription = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i) || [,""])[1];
  const description = currentDescription.length >= 50 ? currentDescription : `${h1}. Independent guidance, comparisons and practical context from Mile Gazette.`;
  const route = cleanRoute(relative);
  const canonical = `${site}${route}`;
  const sectionKey = relative.split("/")[0];
  const sectionMap = {
    cards: { name: "Credit Cards", path: "/cards/" },
    guides: { name: "Guides", path: "/guides/" },
    destinations: { name: "Destinations", path: "/destinations/" },
    "credit-scores": { name: "Credit Scores", path: "/credit-scores/" }
  };
  const hubFiles = new Set([
    "index.html", "about/index.html", "affiliate-disclosure/index.html", "cards/index.html",
    "credit-scores/index.html", "destinations/index.html", "guides/index.html",
    "methodology/index.html", "privacy/index.html", "terms/index.html", "tools/index.html"
  ]);
  const isArticle = !noindex && !hubFiles.has(relative) && !["404.html", "card-comparison.html", "article-detail.html"].includes(relative);
  html = setMetadata(html, { title: currentTitle, description, canonical, article: isArticle });
  const schema = schemaFor({ canonical, title: currentTitle, description, section: sectionMap[sectionKey], article: isArticle });
  if (isArticle && /<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i, `<script type="application/ld+json">${schema}</script>`);
  } else if (!/application\/ld\+json/i.test(html)) {
    html = html.replace("</head>", `  <script type="application/ld+json">${schema}</script>\n</head>`);
  }
  if (isArticle) {
    html = removeUnsupportedExperience(html);
    html = addTrust(html, sectionKey === "cards");
  }
  fs.writeFileSync(file, html);
  audit.push({
    file: relative,
    status: noindex ? "noindex" : "indexable",
    title: currentTitle,
    descriptionLength: description.length,
    canonical,
    articleSchema: isArticle,
    staleYearVisible: /2024|2025/.test(textOnly(html.replace(/<script[\s\S]*?<\/script>/gi, "")))
  });
}

const report = [
  "# Mile Gazette page-by-page SEO audit",
  "",
  `Generated: ${updatedLabel}`,
  "",
  "| Page | Status | Title | Description | Canonical | Article schema | Stale year |",
  "|---|---|---:|---:|---:|---:|---:|",
  ...audit.sort((a,b) => a.file.localeCompare(b.file)).map(row =>
    `| \`${row.file}\` | ${row.status} | ${row.title ? "Yes" : "—"} | ${row.descriptionLength ? `${row.descriptionLength} chars` : "—"} | ${row.canonical ? "Yes" : "—"} | ${row.articleSchema ? "Yes" : "—"} | ${row.staleYearVisible ? "Review" : "No"} |`
  ),
  "",
  "## Notes",
  "",
  "- Redirected URLs are excluded from the canonical sitemap.",
  "- Internal strategy drafts remain `noindex,follow` and are excluded from the sitemap.",
  "- GA4 and Search Console identifiers are intentionally not fabricated; the codebase is ready for the real values.",
  "- Offer terms and destination prices require editorial verification before claims of current accuracy."
].join("\n");
fs.writeFileSync(path.join(root, "SEO_AUDIT.md"), report);

const sitemapUrls = audit
  .filter(row => row.status === "indexable" && row.canonical)
  .map(row => row.canonical)
  .sort((a, b) => a.localeCompare(b));
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapUrls.map(url => `  <url><loc>${url}</loc><lastmod>${updated}</lastmod></url>`),
  '</urlset>',
  ''
].join("\n");
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
