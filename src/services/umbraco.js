import fetch from "node-fetch";
import { routeToSlug, mediaUrl } from "../lib/helpers.js";

// fetch raw content from Umbraco Delivery API
export async function fetchDeliveryRaw() {
  const CMS_BASE = process.env.CMS_BASE; //Why this worked
  const url = `${CMS_BASE}/umbraco/delivery/api/v2/content`;
  const headers = {};

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`CMS error ${res.status}`);
  return res.json();
}

// map raw Umbraco JSON into clean objects for the frontend
export function mapItems(raw) {
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
