const WHATSAPP = "573046269648";
const API = "/api/menu";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (sel, root = document) => root.querySelector(sel);
const money = (n) => "$" + Number(n || 0).toLocaleString("es-CO");

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (k === "style") node.style.cssText = v;
    else node.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null) node.append(c);
  return node;
}

/* ---------------- Estado ---------------- */
let menu = null;
let admin = { password: null };
const cart = new Map(); // key -> { name, variant, price, qty }

/* ---------------- Título letra por letra ---------------- */
let charIndex = 0;
document.querySelectorAll("[data-split]").forEach((line) => {
  const text = line.textContent;
  line.textContent = "";
  for (const ch of text) {
    const span = el("span", { class: "ch" + (ch === " " ? " sp" : ""), "aria-hidden": "true", style: `--i:${charIndex++}` });
    span.textContent = ch === " " ? " " : ch;
    line.append(span);
  }
});

/* ---------------- Fecha de hoy (hora de Colombia) ---------------- */
$("#today").textContent = new Intl.DateTimeFormat("es-CO", {
  weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota",
}).format(new Date()).replace(/^./, (c) => c.toUpperCase());

/* ---------------- Revelado al hacer scroll ---------------- */
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
const observe = (root = document) => root.querySelectorAll(".reveal, .item, .extras").forEach((n) => {
  if (reduceMotion) n.classList.add("in"); else io.observe(n);
});

/* ---------------- Carga del menú ---------------- */
async function loadMenu() {
  $("#menu").append(...Array.from({ length: 6 }, () => el("div", { class: "skeleton" })));
  let data = null;
  try {
    const r = await fetch(API, { cache: "no-store" });
    if (r.ok) data = await r.json();
  } catch { /* sin backend (local): usamos menu.json */ }
  if (!data || !Array.isArray(data.sections)) {
    data = await (await fetch("menu.json", { cache: "no-store" })).json();
  }
  menu = data;
  render();
}

function render() {
  const main = $("#menu");
  main.replaceChildren();
  let total = 0, available = 0;

  menu.sections.forEach((sec) => {
    const on = sec.items.filter((i) => i.available);
    const off = sec.items.filter((i) => !i.available);
    total += sec.items.length;
    available += on.length;

    const list = el("ul", { class: "items" }, on.map((item, idx) => renderItem(sec, item, idx)));
    const section = el("section", { class: "section", id: sec.id },
      el("h2", { class: "section-title reveal" }, el("span", { text: sec.title }), el("span", { class: "count", text: `${on.length}` })),
      sec.note ? el("p", { class: "section-note reveal", text: sec.note }) : null,
      list,
      off.length ? el("div", { class: "soldout reveal" },
        el("p", { class: "soldout-title", text: "Hoy no hay" }),
        el("div", { class: "soldout-list" }, off.flatMap((i, n) => [n ? " · " : null, el("s", { text: i.name })]))
      ) : null,
      sec.extra ? el("div", { class: "extras" },
        el("p", { class: "extras-title", text: "Va con" }),
        el("div", { class: "chips" }, sec.extra.split("·").map((t) => t.trim()).filter(Boolean)
          .map((t, i) => el("span", { class: "chip", style: `--i:${i}`, text: t })))
      ) : null,
    );
    main.append(section);
  });

  // Disponibilidad
  $("#availText").textContent = `${available} de ${total} platos disponibles`;
  requestAnimationFrame(() => { $("#availFill").style.width = total ? `${(available / total) * 100}%` : "0"; });

  buildTabs();
  observe(main);
  syncAddButtons();
}

function renderItem(sec, item, idx) {
  const d = `--d:${Math.min(idx, 8) * 60}ms`;
  if (sec.dual) {
    return el("li", { class: "item dual", style: d },
      el("span", { class: "item-name", text: item.name }),
      el("div", { class: "variants" },
        variantBtn(item, "mesa", item.price),
        variantBtn(item, "llevar", item.price2 ?? item.price),
      ),
    );
  }
  return el("li", { class: "item", style: d },
    el("div", { class: "item-row" },
      el("span", { class: "item-name", text: item.name }),
      el("span", { class: "leader", "aria-hidden": "true" }),
      el("span", { class: "price", text: money(item.price) }),
    ),
    addBtn(item.id, item.name, null, item.price),
  );
}

function variantBtn(item, variant, price) {
  return el("div", { class: "variant", onclick: (e) => { if (e.target.closest(".add")) return; e.currentTarget.querySelector(".add").click(); } },
    el("span", { class: "v-label", text: variant === "mesa" ? "Mesa" : "Llevar" }),
    el("span", { class: "price", text: money(price) }),
    addBtn(item.id, item.name, variant, price),
  );
}

function addBtn(id, name, variant, price) {
  const key = variant ? `${id}|${variant}` : id;
  return el("button", {
    type: "button", class: "add", "data-key": key,
    "aria-label": `Agregar ${name}${variant ? " para " + variant : ""}`,
    onclick: (e) => addToCart(key, { name, variant, price }, e.currentTarget),
  }, "+");
}

/* ---------------- Pestañas con indicador ---------------- */
function buildTabs() {
  const inner = $(".tabs-inner");
  inner.querySelectorAll(".tab").forEach((t) => t.remove());
  const targets = [...menu.sections.map((s) => [s.id, s.title]), ["pedir", "Pedir"]];
  for (const [id, label] of targets) inner.append(el("a", { class: "tab", href: `#${id}`, "data-target": id, text: label }));
  setActiveTab(targets[0][0]);
}

function setActiveTab(id) {
  const tabs = document.querySelectorAll(".tab");
  let active = null;
  tabs.forEach((t) => { const on = t.dataset.target === id; t.classList.toggle("active", on); if (on) active = t; });
  if (!active) return;
  const pill = $("#tabPill");
  pill.style.width = active.offsetWidth + "px";
  pill.style.transform = `translateX(${active.offsetLeft}px)`;
  const inner = $(".tabs-inner");
  const left = active.offsetLeft - inner.clientWidth / 2 + active.offsetWidth / 2;
  inner.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
}

let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const tabsEl = $("#tabs");
    tabsEl.classList.toggle("stuck", tabsEl.getBoundingClientRect().top <= 0);
    const ids = [...document.querySelectorAll(".tab")].map((t) => t.dataset.target);
    let current = ids[0];
    for (const id of ids) {
      const s = document.getElementById(id);
      if (s && s.getBoundingClientRect().top < innerHeight * 0.35) current = id;
    }
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) current = ids[ids.length - 1];
    if (current !== $(".tab.active")?.dataset.target) setActiveTab(current);
  });
}, { passive: true });
addEventListener("resize", () => { const a = $(".tab.active"); if (a) setActiveTab(a.dataset.target); });

/* ---------------- Carrito ---------------- */
function addToCart(key, info, btn) {
  const cur = cart.get(key);
  if (cur) cur.qty++; else cart.set(key, { ...info, qty: 1 });
  if (btn) {
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    flyTo(btn);
  }
  if (navigator.vibrate) navigator.vibrate(12);
  updateCart(true);
}

function flyTo(from) {
  if (reduceMotion) return;
  const target = $("#cartBar").hidden ? $("#waFab") : $("#cartCount");
  const a = from.getBoundingClientRect(), b = target.getBoundingClientRect();
  const dot = el("div", { class: "fly" });
  document.body.append(dot);
  const x0 = a.left + a.width / 2 - 7, y0 = a.top + a.height / 2 - 7;
  const x1 = b.left + (target.id === "cartCount" ? b.width / 2 : 40) - 7, y1 = b.top + b.height / 2 - 7;
  dot.animate([
    { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 },
    { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 120}px) scale(1.3)`, opacity: 1, offset: 0.45 },
    { transform: `translate(${x1}px, ${y1}px) scale(.4)`, opacity: 0.2 },
  ], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => dot.remove();
}

function cartTotals() {
  let count = 0, total = 0;
  for (const it of cart.values()) { count += it.qty; total += it.qty * it.price; }
  return { count, total };
}

function orderMessage() {
  const lines = ["Hola Esteban y Sara 👋 quiero pedir:", ""];
  for (const it of cart.values()) {
    lines.push(`• ${it.qty}x ${it.name}${it.variant ? ` (${it.variant})` : ""} — ${money(it.qty * it.price)}`);
  }
  lines.push("", `Total: ${money(cartTotals().total)}`);
  const note = $("#cartNote").value.trim();
  if (note) lines.push("", note);
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function updateCart(bump = false) {
  const { count, total } = cartTotals();
  $("#cartBar").hidden = count === 0;
  $("#waFab").hidden = count > 0;
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(total);
  $("#sheetTotal").textContent = money(total);
  if (bump) { const c = $("#cartCount"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
  $("#cartSend").href = $("#cartSendQuick").href = orderMessage();

  const list = $("#cartList");
  list.replaceChildren();
  if (!count) list.append(el("li", { class: "cart-empty", text: "Todavía no agregaste nada." }));
  for (const [key, it] of cart) {
    list.append(el("li", {},
      el("span", { class: "ci-name" }, it.name, it.variant ? el("small", { text: it.variant === "mesa" ? "En mesa" : "Para llevar" }) : null),
      el("span", { class: "price", text: money(it.qty * it.price) }),
      el("span", { class: "qty" },
        el("button", { type: "button", "aria-label": "Quitar uno", onclick: () => { if (--it.qty <= 0) cart.delete(key); updateCart(); } }, "−"),
        el("span", { text: it.qty }),
        el("button", { type: "button", "aria-label": "Agregar uno", onclick: () => { it.qty++; updateCart(); } }, "+"),
      ),
    ));
  }
  syncAddButtons();
}

function syncAddButtons() {
  document.querySelectorAll(".add[data-key]").forEach((b) => {
    const it = cart.get(b.dataset.key);
    b.classList.toggle("has", !!it);
    b.replaceChildren(it ? el("span", { class: "q", text: it.qty }) : "+");
  });
}

$("#cartOpen").addEventListener("click", () => $("#cartSheet").showModal());
$("#cartClear").addEventListener("click", () => { cart.clear(); updateCart(); $("#cartSheet").close(); });
$("#cartNote").addEventListener("input", () => { $("#cartSend").href = $("#cartSendQuick").href = orderMessage(); });

/* ---------------- Copiar número de Nequi ---------------- */
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); toast("Número de Nequi copiado ✓"); }
    catch { toast("Nequi: " + btn.dataset.copy); }
    const lbl = btn.querySelector("[data-copy-label]");
    lbl.textContent = "¡Copiado!";
    setTimeout(() => (lbl.textContent = "Tocar para copiar"), 1800);
  });
});

// Brillo que sigue al dedo/mouse en las tarjetas
document.querySelectorAll(".card").forEach((c) => c.addEventListener("pointermove", (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", `${e.clientX - r.left}px`);
  c.style.setProperty("--my", `${e.clientY - r.top}px`);
}));

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- Diálogos: cerrar tocando fuera ---------------- */
document.querySelectorAll("dialog").forEach((d) => {
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => d.close()));
});

/* ---------------- Admin ---------------- */
$("#adminBtn").addEventListener("click", () => {
  if (admin.password) return openAdmin();
  $("#loginMsg").textContent = "";
  $("#loginPass").value = "";
  $("#loginDlg").showModal();
});

$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = $("#loginPass").value;
  const btn = e.submitter; btn.disabled = true;
  try {
    const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "login", password }) });
    if (r.status === 401) throw new Error("Clave incorrecta.");
    if (!r.ok) throw new Error("El panel admin solo funciona con la página publicada en Netlify.");
    admin.password = password;
    $("#loginDlg").close();
    openAdmin();
  } catch (err) {
    $("#loginMsg").textContent = err.message.includes("fetch") ? "No hay conexión con el servidor." : err.message;
    $("#loginDlg").animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "translateX(0)" }], { duration: 300 });
  } finally { btn.disabled = false; }
});

let draft = null;
function openAdmin() {
  draft = structuredClone(menu);
  renderAdmin();
  $("#adminMsg").textContent = "";
  $("#adminDlg").showModal();
}

function renderAdmin() {
  const body = $("#adminBody");
  body.replaceChildren();
  draft.sections.forEach((sec) => {
    const dual = sec.dual ? " dual" : "";
    const rows = sec.items.map((item, idx) => {
      const row = el("div", { class: "adm-row" + dual + (item.available ? "" : " off") },
        el("label", { class: "switch", title: "Disponible hoy" },
          el("input", { type: "checkbox", checked: item.available, "aria-label": `Disponible: ${item.name}`,
            onchange: (e) => { item.available = e.target.checked; row.classList.toggle("off", !item.available); } }),
          el("span"),
        ),
        el("input", { type: "text", value: item.name, "aria-label": "Nombre", oninput: (e) => (item.name = e.target.value) }),
        el("input", { type: "number", inputmode: "numeric", step: "500", min: "0", value: item.price, "aria-label": sec.dual ? "Precio mesa" : "Precio",
          oninput: (e) => (item.price = Number(e.target.value)) }),
        sec.dual ? el("input", { type: "number", inputmode: "numeric", step: "500", min: "0", value: item.price2 ?? item.price, "aria-label": "Precio llevar",
          oninput: (e) => (item.price2 = Number(e.target.value)) }) : null,
        el("button", { type: "button", class: "adm-del", "aria-label": `Borrar ${item.name}`,
          onclick: () => { if (confirm(`¿Borrar "${item.name}" del menú?`)) { sec.items.splice(idx, 1); renderAdmin(); } } }, "✕"),
      );
      return row;
    });
    body.append(el("div", { class: "adm-sec" },
      el("h4", { text: sec.title }),
      el("div", { class: "adm-head" + dual }, el("span", { text: "Hay" }), el("span", { text: "Plato" }),
        el("span", { text: sec.dual ? "Mesa" : "Precio" }), sec.dual ? el("span", { text: "Llevar" }) : null, el("span")),
      rows,
      el("button", { type: "button", class: "adm-add", onclick: () => {
        sec.items.push({ id: `p-${Date.now().toString(36)}`, name: "Nuevo plato", price: sec.items.at(-1)?.price ?? 15000, ...(sec.dual ? { price2: sec.items.at(-1)?.price2 ?? 16000 } : {}), available: true });
        renderAdmin();
        const inputs = body.querySelectorAll(`.adm-sec:nth-child(${draft.sections.indexOf(sec) + 1}) input[type=text]`);
        inputs[inputs.length - 1]?.select();
      } }, "+ Agregar plato"),
      el("label", { class: "field" }, el("span", { text: "Nota debajo del título" }),
        el("input", { type: "text", value: sec.note || "", oninput: (e) => (sec.note = e.target.value) })),
      sec.id === "ejecutivos" || sec.extra ? el("label", { class: "field" }, el("span", { text: "Va con (separa con ·)" }),
        el("textarea", { rows: "2", oninput: (e) => (sec.extra = e.target.value) }, sec.extra || "")) : null,
    ));
  });
}

$("#adminAllOn").addEventListener("click", () => {
  draft.sections.forEach((s) => s.items.forEach((i) => (i.available = true)));
  renderAdmin();
});

$("#adminForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#adminMsg");
  const btn = e.submitter; btn.disabled = true;
  msg.className = "form-msg"; msg.textContent = "Guardando…";
  draft.sections.forEach((s) => { s.items = s.items.filter((i) => i.name.trim()); });
  try {
    const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "save", password: admin.password, menu: draft }) });
    if (r.status === 401) { admin.password = null; throw new Error("La clave ya no es válida. Vuelve a entrar."); }
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "No se pudo guardar.");
    menu = draft;
    render();
    msg.className = "form-msg ok"; msg.textContent = "¡Guardado! Ya lo ven todos.";
    toast("Menú actualizado ✓");
    setTimeout(() => $("#adminDlg").close(), 700);
  } catch (err) {
    msg.textContent = err.message;
  } finally { btn.disabled = false; }
});

/* ---------------- Inicio ---------------- */
observe();
updateCart();
loadMenu();
