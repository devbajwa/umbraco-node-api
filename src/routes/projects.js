import { Router } from "express";
import { fetchDeliveryRaw, mapItems } from "../services/umbraco.js";
import { getCache, setCache } from "../lib/cache.js";

const router = Router();

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const cached = getCache("projects");
    if (cached) return res.json(cached);

    const raw = await fetchDeliveryRaw();
    const mapped = mapItems(raw);
    const projects = mapped.items.filter((i) => i.type === "project") || [];

    setCache("projects", projects);
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// GET /api/projects/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const cacheKey = `project:${slug}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    const raw = await fetchDeliveryRaw();
    const mapped = mapItems(raw);
    const project = mapped.items.find(
      (i) => i.type === "project" && i.slug === slug
    );

    if (!project) {
      return res.status(404).json({ error: "Not Found" });
    }

    setCache(cacheKey, project);
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
