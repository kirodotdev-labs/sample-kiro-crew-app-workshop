import { jsx as r, jsxs as a, Fragment as u } from "react/jsx-runtime";
import { useAppApi as xe, useNotify as ve, useTheme as ye, useChatLauncher as we } from "@kirocrew/app-sdk";
import { useState as w, useRef as ee, useCallback as ke, useEffect as Ne, useMemo as Ce } from "react";
const $e = "backlog-factory", re = "backlog-factory", F = `/api/apps/${$e}`, G = (n) => new URL((/* @__PURE__ */ Object.assign({}))[`./assets/${n}`], import.meta.url).href, Re = [
  { id: "inbox", label: "Inbox" },
  { id: "triage", label: "Triage" },
  { id: "reproduce", label: "Reproduce" },
  { id: "fix", label: "Fix ⇄ Review" },
  { id: "ready", label: "Ready to merge", tone: "green" },
  { id: "needs_you", label: "Needs you", tone: "gold" }
], ae = /* @__PURE__ */ new Set(["inbox", "triage", "reproduce", "fix", "ready", "needs_you", "rejected", "duplicate"]), Be = {
  "factory-triage": "triage",
  "factory-reproduce": "reproduce",
  "factory-fix-review": "fix",
  docs: "triage",
  build: "triage",
  reframe: "triage",
  review: "fix",
  fixing: "fix",
  in_review: "fix",
  "needs-you": "needs_you",
  needs_info: "needs_you",
  reject: "rejected",
  dup: "duplicate"
};
function h(n) {
  const l = String(n.lane || "inbox").trim().toLowerCase();
  return ae.has(l) ? l : Be[l] || "inbox";
}
const Fe = ["Board", "Bugs", "Features", "Needs you"];
function Se(n) {
  const l = typeof document < "u" ? document.documentElement.dataset.mode : "";
  return l === "light" || l === "dark" ? l === "light" : /light/.test(n || "");
}
const je = () => typeof window < "u" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, _e = (n, l) => `https://github.com/${n || "kirodotdev-labs/sample-kiro-crew-app-workshop"}/issues/${l}`, ze = `
@font-face{font-family:"BF Space Grotesk";font-weight:400 700;font-display:swap;src:url("${G("fonts/SpaceGrotesk-latin.woff2")}") format("woff2")}
@font-face{font-family:"BF JetBrains Mono";font-weight:400 500;font-display:swap;src:url("${G("fonts/JetBrainsMono-latin.woff2")}") format("woff2")}
.bf{--red:#EA3A40;--kc:#8E48FF;--green:#3ddc84;--gold:#f2c94c;--sans:"BF Space Grotesk","Space Grotesk",system-ui,sans-serif;--mono:"BF JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;
  --e:cubic-bezier(.16,1,.3,1);--over:cubic-bezier(.34,1.45,.64,1);height:100%;overflow-y:auto;font-family:var(--sans);font-size:16px;line-height:1.45;-webkit-font-smoothing:antialiased}
.bf[data-mode=dark]{--bg:#0e0b14;--ink:#f1edf7;--muted:#b4abc4;--card:#17121f;--card2:#1d1727;--line:#2e2739;--chip:#272033;--red-t:#ff7a7f;--kc-t:#c4a6ff;--green-t:#5be59a;--gold-t:#f5d36b;--code:#0b0910}
.bf[data-mode=light]{--bg:#f7f4fb;--ink:#1b1225;--muted:#4f4560;--card:#ffffff;--card2:#faf8fd;--line:#ddd5e8;--chip:#efe9f6;--red-t:#b8283d;--kc-t:#6a2fd6;--green-t:#137a43;--gold-t:#8a6100;--code:#f3eff8}
.bf{background:var(--bg);color:var(--ink)}
.bf[data-mode=dark]{background:radial-gradient(900px 400px at 85% -10%,#3a1430 0%,transparent 60%),radial-gradient(700px 400px at 0% 0%,#24133d 0%,transparent 60%),var(--bg)}
.bf *{box-sizing:border-box}
.bf a{color:var(--kc-t);text-underline-offset:3px}
.bf :focus-visible{outline:3px solid var(--kc-t);outline-offset:2px;border-radius:8px}
.bf .wrap{padding:22px 28px 40px;max-width:1600px;margin:0 auto}
.bf .rule{height:4px;border-radius:4px;background:linear-gradient(90deg,var(--red),var(--kc));transform-origin:left;margin-bottom:16px}
.bf .top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap}
.bf .crumb{font-size:15px;color:var(--muted)}
.bf h1{font-size:34px;margin:2px 0 14px;letter-spacing:-.01em}
.bf .right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.bf .brand{display:flex;align-items:center;gap:10px}
.bf .brand img.kc{height:30px;width:30px;border-radius:7px}
.bf .pill{font:500 13px var(--mono);border:1px solid var(--line);border-radius:999px;padding:4px 12px;color:var(--muted)}
.bf .pill.ok{border-color:var(--green-t);color:var(--green-t)}
.bf button{font:600 15px var(--sans);border-radius:10px;border:1px solid var(--line);background:var(--card2);color:var(--ink);padding:8px 14px;cursor:pointer;transition:transform .2s var(--e),border-color .2s}
.bf button:hover{border-color:var(--kc)}
.bf button:active{transform:scale(.97)}
.bf button.go{border:0;color:#fff;background:linear-gradient(90deg,#d4283f,#8E48FF)}
.bf button[aria-pressed=true]{outline:2px solid var(--green-t)}
.bf .stats{display:flex;gap:12px;flex-wrap:wrap;margin:6px 0 18px}
.bf .stat{min-width:118px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}
.bf .stat b{display:block;font-size:34px;line-height:1.05}
.bf .stat span{font-size:14px;color:var(--muted)}
.bf .stat.red{border-color:var(--red)} .bf .stat.red b{color:var(--red-t)}
.bf .stat.kc b{color:var(--kc-t)} .bf .stat.gold{border-color:var(--gold)} .bf .stat.gold b{color:var(--gold-t)} .bf .stat.green b{color:var(--green-t)}
.bf .tabs{display:flex;gap:6px;margin:0 0 14px;border-bottom:1px solid var(--line)}
.bf .tabs button{border:0;border-bottom:3px solid transparent;border-radius:0;background:none;padding:10px 14px;color:var(--muted)}
.bf .tabs button[aria-selected=true]{color:var(--ink);border-bottom-color:var(--red)}
.bf .lanes{display:grid;grid-template-columns:repeat(6,minmax(150px,1fr));gap:10px;overflow-x:auto}
.bf .lane{background:color-mix(in srgb,var(--card) 70%,transparent);border:1px solid var(--line);border-radius:12px;padding:8px;min-height:420px}
.bf .lane.green{border-color:var(--green-t)} .bf .lane.gold{border-color:var(--gold)}
.bf .lane h3{display:flex;justify-content:space-between;gap:6px;font:700 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;margin:2px 4px 10px}
.bf .lane.green h3{color:var(--green-t)} .bf .lane.gold h3{color:var(--gold-t)}
.bf .card{background:var(--card2);border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin-bottom:9px;transition:transform .25s var(--over),border-color .2s,box-shadow .2s}
.bf .card:hover,.bf .card:focus-within{transform:translateY(-2px);border-color:var(--kc);box-shadow:0 10px 30px -18px var(--kc)}
.bf .card.hot{border-color:var(--red)}
.bf .num{font:500 12px var(--mono);color:var(--muted)}
.bf .t{font-weight:600;font-size:15px;line-height:1.3;margin:2px 0 6px;overflow-wrap:anywhere}
.bf .chips{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:5px}
.bf .chip{font:500 12px var(--mono);padding:1px 7px;border-radius:5px;background:var(--chip);color:var(--muted)}
.bf .chip.bug{color:var(--red-t)} .bf .chip.feature{color:var(--kc-t)} .bf .chip.g{color:var(--green-t)} .bf .chip.y{color:var(--gold-t)}
.bf .why{font-size:14px;color:var(--muted);overflow-wrap:anywhere}
.bf .foot{display:flex;justify-content:space-between;color:var(--muted);font-size:14px;margin-top:14px;flex-wrap:wrap;gap:10px}
.bf .rv{animation:bf-rise .5s var(--e) backwards;animation-delay:calc(var(--i,0) * 40ms)}
.bf.enter .rule{animation:bf-draw .7s var(--e) both}
.bf.enter .stat{animation:bf-rise .5s var(--e) backwards;animation-delay:calc(var(--i,0) * 60ms)}
@keyframes bf-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes bf-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.bf .empty{background:var(--card);border:1px dashed var(--line);border-radius:14px;padding:28px;max-width:820px}
.bf .empty h2{margin:0 0 8px}
.bf .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.bf input.repo{font:500 15px var(--mono);padding:8px 10px;border-radius:9px;border:1px solid var(--line);background:var(--card2);color:var(--ink);min-width:320px}
.bf .two{display:grid;grid-template-columns:minmax(260px,320px) 1fr;gap:16px}
.bf .list button{display:block;width:100%;text-align:left;margin-bottom:6px}
.bf .list button[aria-current=true]{border-color:var(--red)}
.bf .panel{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.bf .track{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
.bf .track span{font-size:14px;border:1px solid var(--line);border-radius:8px;padding:5px 10px;color:var(--muted)}
.bf .track span.done{border-color:var(--green-t);color:var(--green-t)} .bf .track span.now{border-color:var(--red);color:var(--red-t)}
.bf pre{font:14px/1.5 var(--mono);background:var(--code);border:1px solid var(--line);border-radius:10px;padding:12px;overflow:auto;white-space:pre-wrap;margin:6px 0}
.bf .h{font:700 13px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:14px 0 6px}
.bf .rounds div{display:flex;gap:10px;align-items:baseline;border-top:1px solid var(--line);padding:8px 0}
.bf .ok{color:var(--green-t);font-weight:700} .bf .no{color:var(--red-t);font-weight:700}
.bf .ready{border:1px solid var(--green-t);border-radius:12px;padding:14px;margin-top:12px}
.bf .feats{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.bf .feat{display:flex;flex-direction:column;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}
.bf .feat .step{border-top:1px solid var(--line);padding:8px 0}
.bf .feat .step b{font:700 12px var(--mono);letter-spacing:.06em;color:var(--muted);text-transform:uppercase}
.bf .root{color:var(--gold-t);font-weight:700}
.bf .verdict{margin-top:auto;border-radius:12px;padding:12px;border:1px solid var(--line)}
.bf .verdict.build{border-color:var(--green-t)} .bf .verdict.reframe{border-color:var(--red)} .bf .verdict.needs_you{border-color:var(--gold)} .bf .verdict.reject{border-color:var(--muted)}
.bf .verdict h4{margin:0 0 4px;font-size:18px}
.bf .verdict.build h4{color:var(--green-t)} .bf .verdict.reframe h4{color:var(--red-t)} .bf .verdict.needs_you h4{color:var(--gold-t)}
.bf .needs > div{display:grid;grid-template-columns:150px 1fr auto;gap:14px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px}
.bf .needs .k{font:700 13px var(--mono);letter-spacing:.06em}
.bf .modal{position:fixed;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:50}
.bf .modal > div{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;width:min(900px,92vw);max-height:84vh;overflow:auto}
.bf .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion: reduce){.bf *,.bf *::before{animation:none!important;transition:none!important}}
`;
function Te({ c: n }) {
  return /* @__PURE__ */ a("div", { className: "chips", children: [
    n.kind && /* @__PURE__ */ r("span", { className: `chip ${n.kind}`, children: n.kind }),
    n.size && /* @__PURE__ */ r("span", { className: "chip", children: n.size === "product" ? "product" : n.size }),
    n.status && /* @__PURE__ */ r("span", { className: `chip ${/green|reproduced/.test(n.status) ? "g" : /round|fixing|review/.test(n.status) ? "y" : ""}`, children: n.status }),
    n.dup_of && /* @__PURE__ */ a("span", { className: "chip", children: [
      "dup of #",
      n.dup_of
    ] }),
    n.lane && !ae.has(String(n.lane).trim().toLowerCase()) && /* @__PURE__ */ a("span", { className: "chip y", title: "This lane is not one the board knows", children: [
      "lane: ",
      n.lane
    ] })
  ] });
}
function De() {
  const n = xe(), l = ve(), z = ye(), { openChat: P } = we(), [o, ne] = w(null), [I, O] = w(""), [v, L] = w("Board"), [S, T] = w(""), [te, U] = w(null), [j, E] = w(null), [oe, ie] = w(!0), se = Se(z == null ? void 0 : z.mode) ? "light" : "dark", A = ee(null), K = ee(""), C = ke(async () => {
    try {
      const e = await n.get(`${F}/board`), i = JSON.stringify(e);
      i !== K.current && (K.current = i, ne(e)), O("");
    } catch (e) {
      O(String((e == null ? void 0 : e.message) || e));
    }
  }, [n]);
  Ne(() => {
    n.get(`${F}/settings`).then((t) => T(t.repo)).catch(() => {
    }), C();
    const e = () => {
      document.visibilityState === "visible" && C();
    };
    A.current = window.setInterval(e, 3e3);
    const i = window.setTimeout(() => ie(!1), 1400);
    return () => {
      A.current && window.clearInterval(A.current), window.clearTimeout(i);
    };
  }, [C, n]);
  const x = (o == null ? void 0 : o.issues) || [], b = (e) => x.filter((i) => h(i) === e), de = (o == null ? void 0 : o.decisions) || {}, k = Ce(() => ({
    open: x.length,
    bugs: x.filter((e) => e.kind === "bug").length,
    features: x.filter((e) => e.kind === "feature").length,
    questions: x.filter((e) => e.kind === "question" || e.kind === "docs").length,
    needs: b("needs_you").length + b("ready").length,
    ready: b("ready").length
  }), [o]), le = async () => {
    try {
      const e = await n.post(`${F}/settings`, { repo: S });
      T(e.repo), l(e.repo_exists ? `Repo folder saved: ${e.repo}` : `Saved, but ${e.repo} does not exist yet.`, { type: e.repo_exists ? "success" : "info" }), C();
    } catch (e) {
      l(String((e == null ? void 0 : e.message) || e), { type: "error" });
    }
  }, ce = () => P({
    agent: re,
    autoSend: !0,
    message: `Run the Backlog Factory on my repo folder: ${S || "~/sample-kiro-crew-app-workshop"}. Use every Backlog Factory skill you have, in order, and skip a step that has no new work (the board is the memory). Ask me yes/no once per step. Write nothing to GitHub.`
  }), V = (e) => P({
    agent: re,
    autoSend: !0,
    message: `Send #${e.n} back to the fixer for one more round. Repo folder: ${S}. My note: (type it here). Follow the fix-review skill; ask me yes/no first.`
  }), p = async (e, i) => {
    try {
      await n.post(`${F}/decide`, { n: e, choice: i }), l(`#${e}: ${i.replace(/_/g, " ")} saved. The next run uses it.`, { type: "success" }), C();
    } catch (t) {
      l(String((t == null ? void 0 : t.message) || t), { type: "error" });
    }
  }, M = async (e, i) => {
    try {
      await navigator.clipboard.writeText(e), l(`${i} copied.`, { type: "success" });
    } catch {
      l(e, { type: "info" });
    }
  }, Y = async (e) => {
    try {
      const i = await n.raw(`${F}/diff?n=${e}`);
      E({ n: e, text: await i.text() });
    } catch {
      l(`No saved diff for #${e} yet.`, { type: "info" });
    }
  }, f = (e, i) => {
    var t;
    return ((t = de[String(e)]) == null ? void 0 : t.choice) === i;
  }, pe = (e, i) => /* @__PURE__ */ a("div", { className: "top", children: [
    /* @__PURE__ */ a("div", { children: [
      /* @__PURE__ */ r("div", { className: "crumb", children: e }),
      /* @__PURE__ */ r("h1", { children: i })
    ] }),
    /* @__PURE__ */ a("div", { className: "right", children: [
      /* @__PURE__ */ r("div", { className: "brand", children: /* @__PURE__ */ r("img", { className: "kc", src: G("kirocrew-icon.png"), alt: "Kiro Crew" }) }),
      /* @__PURE__ */ r("span", { className: "pill", children: "Timer 7:00 AM ET · Mon-Fri · paused" }),
      /* @__PURE__ */ r("button", { className: "go", onClick: ce, children: "Run now" })
    ] })
  ] }), fe = /* @__PURE__ */ r("div", { className: "stats", role: "list", "aria-label": "Counts", children: [
    ["open issues", k.open, ""],
    ["bugs", k.bugs, "red"],
    ["features", k.features, "kc"],
    ["questions + docs", k.questions, ""],
    ["need you", k.needs, "gold"],
    ["ready to merge", k.ready, "green"]
  ].map(([e, i, t], c) => /* @__PURE__ */ a("div", { role: "listitem", className: `stat ${t}`, style: { "--i": c }, children: [
    /* @__PURE__ */ r("b", { children: i }),
    /* @__PURE__ */ r("span", { children: e })
  ] }, e)) }), ue = () => {
    var e, i;
    return /* @__PURE__ */ a(u, { children: [
      /* @__PURE__ */ r("div", { className: "lanes", children: Re.map((t) => {
        const c = b(t.id);
        return /* @__PURE__ */ a("section", { className: `lane ${t.tone || ""}`, "aria-label": `${t.label}, ${c.length} issues`, children: [
          /* @__PURE__ */ a("h3", { children: [
            /* @__PURE__ */ r("span", { children: t.label }),
            /* @__PURE__ */ r("span", { children: c.length })
          ] }),
          c.map((d, g) => /* @__PURE__ */ a("article", { className: `card rv ${h(d) === "fix" ? "hot" : ""}`, style: { "--i": g }, children: [
            /* @__PURE__ */ r("div", { className: "num", children: /* @__PURE__ */ a("a", { href: _e(o == null ? void 0 : o.repo, d.n), target: "_blank", rel: "noreferrer", children: [
              "#",
              d.n
            ] }) }),
            /* @__PURE__ */ r("div", { className: "t", children: d.title }),
            /* @__PURE__ */ r(Te, { c: d }),
            d.reason && /* @__PURE__ */ r("div", { className: "why", children: d.reason }),
            d.kind === "bug" && h(d) !== "inbox" && /* @__PURE__ */ r("button", { style: { marginTop: 6, fontSize: 13, padding: "4px 10px" }, onClick: () => {
              U(d.n), L("Bugs");
            }, children: "Details" })
          ] }, d.n))
        ] }, t.id);
      }) }),
      /* @__PURE__ */ a("div", { className: "foot", children: [
        /* @__PURE__ */ a("span", { children: [
          "Rejected ",
          b("rejected").length,
          " · Duplicate ",
          b("duplicate").length,
          " · ",
          b("rejected").concat(b("duplicate")).map((t) => `#${t.n}`).join(" ") || "none yet"
        ] }),
        /* @__PURE__ */ a("span", { children: [
          ((e = o == null ? void 0 : o.run) == null ? void 0 : e.state) === "running" ? `Running: ${(i = o == null ? void 0 : o.run) == null ? void 0 : i.step}` : `Last run ${(o == null ? void 0 : o.updated) || "—"}`,
          " · ",
          x.length,
          " read (",
          (o == null ? void 0 : o.source) || "live",
          ")"
        ] })
      ] })
    ] });
  }, $ = x.filter((e) => e.kind === "bug" && !["duplicate", "inbox"].includes(h(e))), he = () => {
    var c, d, g, B, N, _, H, X, Q;
    const e = $.find((s) => s.n === te) || $.find((s) => h(s) === "ready") || $.find((s) => h(s) === "fix") || $[0];
    if (!e) return /* @__PURE__ */ r("p", { className: "why", children: "No bugs sorted yet. Run the factory first." });
    typeof e.repro == "string" && (e.repro = { note: e.repro, result: "noted" });
    const i = [["Sorted: bug", !0], ["Reproduced", !!((c = e.repro) != null && c.result)], ["Details added", !!e.details], [`Fix ⇄ Review${(g = (d = e.fix) == null ? void 0 : d.rounds) != null && g.length ? ` · round ${e.fix.rounds.length}` : ""}`, h(e) === "ready"], ["Ready to merge", h(e) === "ready"], ["You merge", !1]], t = i.findIndex(([, s]) => !s);
    return /* @__PURE__ */ a("div", { className: "two", children: [
      /* @__PURE__ */ r("nav", { className: "list", "aria-label": "Bugs", children: $.map((s) => /* @__PURE__ */ a("button", { "aria-current": s.n === e.n, onClick: () => U(s.n), children: [
        "#",
        s.n,
        " ",
        s.title,
        /* @__PURE__ */ r("br", {}),
        /* @__PURE__ */ r("span", { className: "why", children: s.status || s.lane })
      ] }, s.n)) }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ r("div", { className: "track", "aria-label": "Progress", children: i.map(([s, y], m) => /* @__PURE__ */ a("span", { className: y ? "done" : m === t ? "now" : "", children: [
          y ? "✓ " : "",
          s
        ] }, s)) }),
        /* @__PURE__ */ a("div", { className: "two", style: { gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)" }, children: [
          /* @__PURE__ */ a("div", { className: "panel", children: [
            /* @__PURE__ */ r("div", { className: "h", children: "What the agents found" }),
            /* @__PURE__ */ a("p", { children: [
              /* @__PURE__ */ r("b", { children: "Sorted as a bug" }),
              " ",
              /* @__PURE__ */ r("span", { className: "why", children: "triage" }),
              /* @__PURE__ */ r("br", {}),
              e.reason,
              e.dup_of ? ` Same as #${e.dup_of}.` : ""
            ] }),
            (N = (B = e.frame) == null ? void 0 : B.whys) != null && N.length ? /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ r("div", { className: "h", children: "Five whys" }),
              e.frame.whys.map((s, y) => /* @__PURE__ */ a("div", { className: "why", children: [
                "why? ",
                s
              ] }, y))
            ] }) : null,
            e.repro ? /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ a("div", { className: "h", children: [
                "Reproduced · ",
                e.repro.where || "your clone"
              ] }),
              /* @__PURE__ */ a("pre", { children: [
                e.repro.cmd ? `$ ${e.repro.cmd}
${e.repro.out || ""}` : "",
                e.repro.note ? `
← ${e.repro.note}` : "",
                e.repro.test ? `
new test: ${e.repro.test}  ${e.repro.result || ""}` : ""
              ] })
            ] }) : /* @__PURE__ */ r("p", { className: "why", children: "Not reproduced yet." }),
            e.details && /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ r("div", { className: "h", children: "Details added" }),
              /* @__PURE__ */ r("p", { className: "root", children: e.details })
            ] })
          ] }),
          /* @__PURE__ */ a("div", { className: "panel", children: [
            /* @__PURE__ */ r("div", { className: "h", children: "Fix ⇄ Review" }),
            /* @__PURE__ */ a("div", { className: "row", style: { justifyContent: "space-between" }, children: [
              /* @__PURE__ */ r("div", { className: "chip", children: "Fixer · writes the fix" }),
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "⇄" }),
              /* @__PURE__ */ r("div", { className: "chip", children: "Reviewer · reads diff, runs tests" })
            ] }),
            /* @__PURE__ */ a("div", { className: "rounds", children: [
              (((_ = e.fix) == null ? void 0 : _.rounds) || []).map((s, y) => {
                const m = s, ge = m.n ?? m.round ?? y + 1, Z = /green/i.test(String(m.verdict ?? m.review ?? ""));
                return /* @__PURE__ */ a("div", { children: [
                  /* @__PURE__ */ a("span", { className: "num", children: [
                    "round ",
                    ge
                  ] }),
                  m.stat && /* @__PURE__ */ r("span", { className: "chip", children: m.stat }),
                  /* @__PURE__ */ r("span", { className: Z ? "ok" : "no", children: Z ? "Green:" : "Changes asked:" }),
                  /* @__PURE__ */ r("span", { className: "why", children: m.note ?? m.fixer ?? m.tests ?? "" })
                ] }, y);
              }),
              ((H = e.fix) == null ? void 0 : H.branch) && /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ r("span", { className: "num", children: "branch" }),
                /* @__PURE__ */ r("span", { className: "chip", children: e.fix.branch }),
                /* @__PURE__ */ r("span", { className: "why", children: "local · not pushed" })
              ] }),
              !((Q = (X = e.fix) == null ? void 0 : X.rounds) != null && Q.length) && /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r("span", { className: "why", children: "No rounds yet." }) })
            ] }),
            h(e) === "ready" && /* @__PURE__ */ a("div", { className: "ready", children: [
              /* @__PURE__ */ r("b", { className: "ok", children: "Ready for you" }),
              /* @__PURE__ */ r("p", { className: "why", children: "Review is green. Read the diff, then merge it yourself." }),
              /* @__PURE__ */ a("div", { className: "row", children: [
                /* @__PURE__ */ r("button", { className: "go", onClick: () => Y(e.n), children: "Open diff" }),
                /* @__PURE__ */ r("button", { onClick: () => {
                  var s;
                  return M(((s = e.fix) == null ? void 0 : s.merge_cmd) || `git merge factory/fix-${e.n}`, "Merge command");
                }, children: "Copy merge command" }),
                /* @__PURE__ */ r("button", { onClick: () => V(e), children: "Send back" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] });
  }, q = x.filter((e) => (e.kind === "feature" || e.kind === "docs") && e.frame && ["triage", "needs_you", "rejected", "inbox"].includes(h(e))), D = {
    build: ["Build it", "Goes to the fixer."],
    reframe: ["Reframe it", "Solve the root, not the ask."],
    needs_you: ["Needs you", "Product-level. Your call."],
    reject: ["Reject", "Not a good problem for jot."]
  }, me = () => /* @__PURE__ */ a(u, { children: [
    /* @__PURE__ */ a("div", { className: "track", children: [
      /* @__PURE__ */ r("span", { className: "now", children: "1 · Good problem?" }),
      /* @__PURE__ */ r("span", { className: "now", children: "2 · Five whys → root" }),
      /* @__PURE__ */ r("span", { className: "now", children: "3 · First principles → best fix" }),
      /* @__PURE__ */ r("span", { children: "Build · Reframe · Needs you · Reject" })
    ] }),
    !q.length && /* @__PURE__ */ r("p", { className: "why", children: "No features sorted yet. Run the factory first." }),
    /* @__PURE__ */ r("div", { className: "feats", children: q.map((e, i) => {
      var c, d, g, B;
      const t = e.verdict && D[e.verdict] ? e.verdict : h(e) === "needs_you" ? "needs_you" : h(e) === "rejected" ? "reject" : "build";
      return /* @__PURE__ */ a("article", { className: "feat rv", style: { "--i": i }, children: [
        /* @__PURE__ */ a("div", { className: "num", children: [
          "#",
          e.n,
          " · ",
          e.kind
        ] }),
        /* @__PURE__ */ r("h3", { style: { margin: "2px 0 6px" }, children: e.title }),
        /* @__PURE__ */ a("div", { className: "chips", children: [
          e.size && /* @__PURE__ */ r("span", { className: `chip ${e.size === "small" ? "g" : "y"}`, children: e.size === "product" ? "product-level" : e.size }),
          e.asked && e.asked.length > 1 && /* @__PURE__ */ a("span", { className: "chip", children: [
            "asked ",
            e.asked.length,
            "×: ",
            e.asked.map((N) => `#${N}`).join(" ")
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "step", children: [
          /* @__PURE__ */ r("b", { children: "1 · Good problem?" }),
          /* @__PURE__ */ r("div", { children: (c = e.frame) == null ? void 0 : c.good })
        ] }),
        /* @__PURE__ */ a("div", { className: "step", children: [
          /* @__PURE__ */ r("b", { children: "2 · Five whys" }),
          (((d = e.frame) == null ? void 0 : d.whys) || []).map((N, _) => /* @__PURE__ */ a("div", { className: "why", children: [
            "why? ",
            N
          ] }, _)),
          ((g = e.frame) == null ? void 0 : g.root) && /* @__PURE__ */ a("div", { className: "root", children: [
            "Root: ",
            e.frame.root
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "step", children: [
          /* @__PURE__ */ r("b", { children: "3 · First principles" }),
          /* @__PURE__ */ r("div", { children: (B = e.frame) == null ? void 0 : B.best })
        ] }),
        /* @__PURE__ */ a("div", { className: `verdict ${t}`, children: [
          /* @__PURE__ */ r("h4", { children: D[t][0] }),
          /* @__PURE__ */ r("div", { className: "why", children: e.lean || D[t][1] }),
          /* @__PURE__ */ a("div", { className: "row", style: { marginTop: 8 }, children: [
            t === "build" && /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ r("button", { className: "go", "aria-pressed": f(e.n, "build"), onClick: () => p(e.n, "build"), children: "OK" }),
              /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "reject"), onClick: () => p(e.n, "reject"), children: "No" })
            ] }),
            t === "reframe" && /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ r("button", { className: "go", "aria-pressed": f(e.n, "reframe"), onClick: () => p(e.n, "reframe"), children: "OK" }),
              /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "as_asked"), onClick: () => p(e.n, "as_asked"), children: "Build as asked" })
            ] }),
            t === "needs_you" && /* @__PURE__ */ a(u, { children: [
              /* @__PURE__ */ r("button", { className: "go", "aria-pressed": f(e.n, "agree"), onClick: () => p(e.n, "agree"), children: "Agree with lean" }),
              /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "build"), onClick: () => p(e.n, "build"), children: "Build all" }),
              /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "reject"), onClick: () => p(e.n, "reject"), children: "Reject" })
            ] }),
            t === "reject" && /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "build"), onClick: () => p(e.n, "build"), children: "Build anyway" })
          ] })
        ] })
      ] }, e.n);
    }) })
  ] }), J = {
    merge: ["MERGE", "var(--green-t)"],
    product: ["PRODUCT CALL", "var(--gold-t)"],
    cant_reproduce: ["CAN'T REPRODUCE", "var(--red-t)"],
    needs_info: ["NEEDS INFO", "var(--red-t)"],
    stuck: ["STUCK", "var(--red-t)"]
  }, R = [...b("ready").map((e) => ({ ...e, needs: "merge" })), ...b("needs_you")], be = () => /* @__PURE__ */ a("div", { className: "needs", children: [
    !R.length && /* @__PURE__ */ r("p", { className: "why", children: "Nothing needs you yet." }),
    R.map((e) => {
      var c, d;
      const [i, t] = J[e.needs || "product"] || J.product;
      return /* @__PURE__ */ a("div", { className: "rv", children: [
        /* @__PURE__ */ r("span", { className: "k", style: { color: t }, children: i }),
        /* @__PURE__ */ a("div", { children: [
          /* @__PURE__ */ a("b", { children: [
            "#",
            e.n,
            " ",
            e.title
          ] }),
          /* @__PURE__ */ r("div", { className: "why", children: e.needs === "merge" ? `Review green · tests ${((c = e.fix) == null ? void 0 : c.tests) || "?"} · branch ${((d = e.fix) == null ? void 0 : d.branch) || ""}` : e.lean || e.reason })
        ] }),
        /* @__PURE__ */ a("div", { className: "row", children: [
          e.needs === "merge" && /* @__PURE__ */ a(u, { children: [
            /* @__PURE__ */ r("button", { className: "go", onClick: () => Y(e.n), children: "Open diff" }),
            /* @__PURE__ */ r("button", { onClick: () => {
              var g;
              return M(((g = e.fix) == null ? void 0 : g.merge_cmd) || `git merge factory/fix-${e.n}`, "Merge command");
            }, children: "Copy merge command" })
          ] }),
          e.needs === "product" && /* @__PURE__ */ a(u, { children: [
            /* @__PURE__ */ r("button", { className: "go", "aria-pressed": f(e.n, "agree"), onClick: () => p(e.n, "agree"), children: "Agree" }),
            /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "build"), onClick: () => p(e.n, "build"), children: "Build" }),
            /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "reject"), onClick: () => p(e.n, "reject"), children: "Reject" })
          ] }),
          (e.needs === "cant_reproduce" || e.needs === "needs_info") && /* @__PURE__ */ a(u, { children: [
            /* @__PURE__ */ r("button", { className: "go", onClick: () => M(e.reply || e.reason || "", "Reply"), children: "Copy reply" }),
            /* @__PURE__ */ r("button", { "aria-pressed": f(e.n, "park"), onClick: () => p(e.n, "park"), children: "Park it" })
          ] }),
          e.needs === "stuck" && /* @__PURE__ */ r("button", { onClick: () => V(e), children: "Send back" })
        ] })
      ] }, e.n);
    }),
    /* @__PURE__ */ a("div", { className: "foot", children: [
      /* @__PURE__ */ r("span", { children: "Everything else runs on its own. You only see these." }),
      /* @__PURE__ */ r("span", { children: "All fixes on local branches" })
    ] })
  ] }), W = {
    Board: [`${(o == null ? void 0 : o.repo) || "sample-kiro-crew-app-workshop"} · read only`, "Backlog Factory"],
    Bugs: ["Backlog Factory > Bugs", "Prove it, fix it, review it"],
    Features: ["Backlog Factory > Features", "Is it a good problem? Then the best fix."],
    "Needs you": ["Backlog Factory > Needs you", `${R.length} things only you can decide`]
  };
  return /* @__PURE__ */ a("div", { className: `bf ${oe && !je() ? "enter" : ""}`, "data-mode": se, children: [
    /* @__PURE__ */ r("style", { children: ze }),
    /* @__PURE__ */ a("div", { className: "wrap", children: [
      /* @__PURE__ */ r("div", { className: "rule", "aria-hidden": "true" }),
      pe(W[v][0], W[v][1]),
      /* @__PURE__ */ a("div", { className: "row", style: { margin: "0 0 12px" }, children: [
        /* @__PURE__ */ r("label", { htmlFor: "bf-repo", children: /* @__PURE__ */ r("b", { children: "Repo folder" }) }),
        /* @__PURE__ */ r("input", { id: "bf-repo", className: "repo", value: S, onChange: (e) => T(e.target.value), placeholder: "~/sample-kiro-crew-app-workshop" }),
        /* @__PURE__ */ r("button", { onClick: le, children: "Save" }),
        I && /* @__PURE__ */ a("span", { className: "no", role: "alert", children: [
          "Board not readable: ",
          I
        ] })
      ] }),
      o != null && o.empty ? /* @__PURE__ */ a("div", { className: "empty", children: [
        /* @__PURE__ */ r("h2", { children: "No board yet" }),
        /* @__PURE__ */ a("p", { children: [
          "The factory writes ",
          /* @__PURE__ */ r("code", { children: "factory/board.json" }),
          " in your repo folder (",
          o.repo,
          o.repo_exists ? "" : ", not found: fix the folder above",
          ")."
        ] }),
        /* @__PURE__ */ a("p", { children: [
          "Press ",
          /* @__PURE__ */ r("b", { children: "Run now" }),
          ". A chat opens with the backlog-factory agent. It asks yes/no before it writes, and it never writes to GitHub."
        ] })
      ] }) : /* @__PURE__ */ a(u, { children: [
        fe,
        /* @__PURE__ */ r("div", { className: "tabs", role: "tablist", children: Fe.map((e) => /* @__PURE__ */ a("button", { role: "tab", "aria-selected": v === e, onClick: () => L(e), children: [
          e,
          e === "Needs you" && R.length ? ` (${R.length})` : ""
        ] }, e)) }),
        /* @__PURE__ */ a("div", { role: "tabpanel", children: [
          v === "Board" && ue(),
          v === "Bugs" && he(),
          v === "Features" && me(),
          v === "Needs you" && be()
        ] })
      ] })
    ] }),
    j && /* @__PURE__ */ r("div", { className: "modal", role: "dialog", "aria-modal": "true", "aria-label": `Diff for #${j.n}`, onClick: () => E(null), children: /* @__PURE__ */ a("div", { onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ a("div", { className: "row", style: { justifyContent: "space-between" }, children: [
        /* @__PURE__ */ a("b", { children: [
          "factory/fix-",
          j.n,
          " · local, not pushed"
        ] }),
        /* @__PURE__ */ r("button", { autoFocus: !0, onClick: () => E(null), children: "Close" })
      ] }),
      /* @__PURE__ */ r("pre", { children: j.text })
    ] }) })
  ] });
}
export {
  De as default
};
