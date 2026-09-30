import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const digest = (s) => createHash("sha256").update(String(s)).digest();

function passwordOk(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof password !== "string") return false;
  return timingSafeEqual(digest(password), digest(expected));
}

function cleanMenu(menu) {
  if (!menu || !Array.isArray(menu.sections) || menu.sections.length > 20) return null;
  const str = (v, max) => String(v ?? "").slice(0, max);
  const num = (v) => Math.max(0, Math.min(10_000_000, Math.round(Number(v) || 0)));
  return {
    sections: menu.sections.map((s) => {
      if (!Array.isArray(s.items) || s.items.length > 80) throw new Error("items");
      return {
        id: str(s.id, 40).replace(/[^a-z0-9-]/gi, "") || "seccion",
        title: str(s.title, 60),
        note: str(s.note, 200),
        dual: Boolean(s.dual),
        extra: str(s.extra, 500),
        items: s.items.map((i) => ({
          id: str(i.id, 60),
          name: str(i.name, 100),
          price: num(i.price),
          ...(s.dual ? { price2: num(i.price2 ?? i.price) } : {}),
          available: Boolean(i.available),
        })),
      };
    }),
  };
}

export default async (req) => {
  const store = getStore("menu");

  if (req.method === "GET") {
    const data = await store.get("current", { type: "json" });
    return json(data ?? null);
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
    if (!process.env.ADMIN_PASSWORD) return json({ error: "Falta configurar ADMIN_PASSWORD en Netlify." }, 500);
    if (!passwordOk(body.password)) return json({ error: "Clave incorrecta" }, 401);

    if (body.action === "login") return json({ ok: true });

    if (body.action === "save") {
      let menu;
      try { menu = cleanMenu(body.menu); } catch { menu = null; }
      if (!menu) return json({ error: "Menú inválido" }, 400);
      await store.setJSON("current", menu);
      return json({ ok: true });
    }
    return json({ error: "Acción desconocida" }, 400);
  }

  return json({ error: "Método no permitido" }, 405);
};

export const config = { path: "/api/menu" };
