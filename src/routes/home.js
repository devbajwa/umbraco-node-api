import { Router } from "express";
import { fetchDeliveryRaw, mapItems } from "../services/umbraco.js";
import { getCache, setCache } from "../lib/cache.js";

const router = Router();

router.get("/", async (req, res) => {
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

export default router;
