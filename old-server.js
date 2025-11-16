import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ quiet: true });

const app = express();
app.use(cors()); //for local dev, frontend at differnt port
app.use(express.json());

const PORT = process.env.PORT || 4000;
const CMS_BASE = process.env.CMS_BASE;

// Tiny Helpers

// The routeToSlug function is designed to clean up a given route path by removing any leading or trailing forward slashes (/), effectively converting a full path into a clean "slug" "/e-commerce-platform/" to cleaned Path will be: "e-commerce-platform"
function routeToSlug(routePath = "") {
  return routePath.replace(/^\/+|\/+$/g, "");
}

function mediaUrl(relativeUrl = "") {
  if (!relativeUrl) return "";
  return relativeUrl.startsWith("http")
    ? relativeUrl
    : `${CMS_BASE}${relativeUrl}`;
}

// very simple in-memory cache with TTL
const cache = new Map();
function setCache(key, data, ttlMs = 60000) {
  // 60s
  cache.set(key, { data, expires: Date.now() + ttlMs });
}
function getCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

// fetch raw content from Umbraco Delivery API
async function fetchDeliveryRaw() {
  const url = `${CMS_BASE}/umbraco/delivery/api/v2/content`;
  const headers = {};

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`CMS error ${res.status}`);
  return res.json();
}

// map raw Umbraco JSON into clean objects for the frontend
function mapItems(raw) {
  const items = raw?.items || [];

  const mapped = items.map((i) => {
    const p = i.properties || {};
    const slug = routeToSlug(i?.route?.path || "");
    const imageUrl = p.image?.[0]?.url ? mediaUrl(p.image[0].url) : "";

    return {
      id: i.id,
      type: i.contentType,
      name: i.name,
      slug,
      updatedAt: i.updateDate,
      title: p.title ?? i.name,
      subTitle: p.subTitle ?? "",
      bodyText: p.bodyText?.markup ?? "",
      descriptionHtml: p.description?.markup ?? "",
      technologies: p.technologies ?? "",
      heroImage: p.heroImage?.[0]?.url ? mediaUrl(p.heroImage[0].url) : "",
      image: imageUrl,
      projectLink: p.projectLink ?? "",
    };
  });

  return {
    total: raw?.total || mapped.length,
    items: mapped,
  };
}

/***
 ROUTES
 */

// Homepage content
app.get("/api/home", async (req, res) => {
  try {
    const cached = getCache("home");
    if (cached) return res.json(cached);

    const raw = await fetchDeliveryRaw();
    const mapped = mapItems(raw);
    const home = mapped.items.find((i) => i.type === "homePage") || null;
    setCache("home", home);
    res.json(home);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Projects list
app.get("/api/projects", async (req, res) => {
  try {
    const cached = getCache("projects");
    if (cached) return res.json(cached);

    const raw = await fetchDeliveryRaw();
    const mapped = mapItems(raw);
    const projects = mapped.items.filter((i) => i.type === "project") || null;
    setCache("projects", projects);
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// Project Single
app.get("/api/projects/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    // Small per slug - cache
    const ckey = `project:${slug}`;
    const cached = getCache(ckey);
    if (cached) return res.json(cached);

    const raw = await fetchDeliveryRaw();
    const mapped = mapItems(raw);
    const project = mapped.items.find((i) => {
      return i.type === "project" && i.slug === slug;
    });

    if (!project) return res.status(404).json({ error: "Not Found" });

    setCache(ckey, project);
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
