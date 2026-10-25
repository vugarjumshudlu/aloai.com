import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { CH, HERO_FEED, PROBLEM_BUBBLES, PLATFORM_CAPTIONS, SECTORS } from "./data.js";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(pointer: fine)").matches;
const DESKTOP = "(min-width: 1024px)";
const MOBILE = "(max-width: 1023px)";

const CHECK_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const MIC_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3"/></svg>';

/* ---------------------------------------------------------------- helpers */

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/** Scrub-safe typing: the text length follows the tween, so it also "untypes" when scrolling back. */
function typeTween(node, text, vars = {}) {
  const p = { n: 0 };
  node.textContent = "";
  return gsap.to(p, {
    n: text.length,
    ease: "none",
    duration: vars.duration ?? Math.max(0.4, text.length * 0.03),
    ...vars,
    onUpdate() {
      node.textContent = text.slice(0, Math.round(p.n));
      vars.onUpdate?.();
    },
  });
}

function countTween(node, to, vars = {}) {
  const p = { v: 0 };
  const suffix = node.dataset.suffix ?? "";
  return gsap.to(p, {
    v: to,
    ease: "power2.out",
    duration: 1.2,
    ...vars,
    onUpdate() {
      node.textContent = Math.round(p.v).toLocaleString("az-AZ").replace(/ |,/g, " ") + suffix;
    },
  });
}

/** Message "grows" into a chat column (height + fade) — keeps the column bottom-anchored.
 *  The end height is function-based so it is re-measured on refresh (fonts, resize). */
const growIn = (targets, vars = {}) =>
  gsap.fromTo(
    targets,
    { height: 0, marginTop: -10, opacity: 0, y: 12 },
    {
      height: (i, t) => t.scrollHeight,
      marginTop: 0,
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      ...vars,
    }
  );

/** Fade/slide in elements as they enter the viewport. */
function reveal(scope) {
  $$(".reveal-up", scope).forEach((n) => {
    gsap.from(n, {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: n, start: "top 88%", once: true },
    });
  });
}

function batchReveal(selector, vars = {}) {
  const items = $$(selector);
  if (!items.length) return;
  gsap.set(items, { opacity: 0, y: vars.y ?? 48 });
  ScrollTrigger.batch(items, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, x: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
  });
}

/** Fills everything that would otherwise be typed/counted — used when motion is reduced. */
function showFinalStates() {
  $$("[data-type]").forEach((n) => (n.textContent = n.dataset.type));
  $$("[data-fill]").forEach((n) => (n.textContent = n.dataset.fill));
  $$("[data-count]").forEach((n) => (n.textContent = n.dataset.count + (n.dataset.suffix ?? "")));
  $("#setupMin").textContent = "15";
  $(".file-pct").textContent = "68%";
  gsap.set(".file-bar", { scaleX: 0.68 });
  $$(".switch").forEach((s) => s.classList.add("is-on"));
  $$(".source").forEach((s) => s.classList.add("is-on"));
  $$(".ho-step").forEach((s) => s.classList.add("is-on"));
  $(".ho-owner").textContent = "Menecer: Nigar H.";
  $(".cta-count b").textContent = "0";
  $("#problemCount").textContent = "47";
}

/* ---------------------------------------------------------------- smooth scroll + nav */

let lenis = null;

function initScroll() {
  if (!REDUCED) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links go through Lenis so pinned sections land correctly.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id === "#top" ? 0 : $(id);
      if (target == null) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -24, duration: 1.4 });
      else if (target === 0) window.scrollTo(0, 0);
      else target.scrollIntoView();
    });
  });

  gsap.to(".scroll-progress span", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  const nav = $("#nav");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle("is-scrolled", y > 20);
      nav.classList.toggle("is-hidden", self.direction === 1 && y > 600);
    },
  });
}

function initActiveNav() {
  const links = $$(".nav__links a");
  links.forEach((a) => {
    const sec = $(a.getAttribute("href"));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top 45%",
      end: "bottom 45%",
      onToggle(self) {
        a.classList.toggle("is-active", self.isActive);
      },
    });
  });
}

/* ---------------------------------------------------------------- micro interactions */

function initMagnetic() {
  if (!FINE_POINTER || REDUCED) return;
  $$(".magnetic").forEach((b) => {
    const x = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3.out" });
    const y = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3.out" });
    b.addEventListener("pointermove", (e) => {
      const r = b.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.25);
      y((e.clientY - r.top - r.height / 2) * 0.35);
    });
    b.addEventListener("pointerleave", () => {
      x(0);
      y(0);
    });
  });
}

function initTilt() {
  if (!FINE_POINTER || REDUCED) return;
  $$(".tilt").forEach((card) => {
    gsap.set(card, { transformPerspective: 1200 });
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    card.addEventListener("pointerleave", () => {
      rx(0);
      ry(0);
    });
  });
}

/* ---------------------------------------------------------------- 01 hero */

function feedItem(d) {
  const c = CH[d.ch];
  const text = d.voice
    ? `<span class="voice-tag">${MIC_SVG}</span><span class="voice-tag">Səsli · ${d.voice}</span> → ${d.text}`
    : d.text;
  const n = el(
    "div",
    "feed-item",
    `<div class="feed-item__top"><span class="feed-item__ch" style="--c:${c.color}"><span class="dot"></span>${c.label} · ${d.name}</span><span class="feed-item__time">indi</span></div>
     <span class="feed-item__text" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">${text}</span>
     <span class="feed-item__status"></span>`
  );
  return n;
}

const setDone = (item) => {
  item.classList.remove("is-typing");
  const s = $(".feed-item__status", item);
  s.classList.add("is-done");
  s.innerHTML = `${CHECK_SVG}AI cavabladı`;
};
const setTyping = (item) => {
  item.classList.add("is-typing");
  $(".feed-item__status", item).innerHTML = '<span class="typing"><i></i><i></i><i></i></span>AI cavab yazır…';
};

function initHero() {
  const list = $("#heroFeed");
  const count = $(".feed__count");
  const MAX = 4;

  if (REDUCED) {
    HERO_FEED.slice(0, MAX).forEach((d) => {
      const n = feedItem(d);
      setDone(n);
      list.append(n);
    });
    return;
  }

  // Intro
  const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".hero__title .line__in", { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .from(".hero .reveal-up", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
    .from(".feed", { y: 60, opacity: 0, rotationX: 12, transformPerspective: 1200, duration: 1.1 }, "-=0.9")
    .from(".nav", { opacity: 0, duration: 0.6 }, 0.1)
    .from(".hero__glow", { scale: 0.6, opacity: 0, duration: 2, ease: "power2.out" }, 0);

  // Live feed loop
  let i = 0;
  let running = false;
  let timer = null;

  function step() {
    const d = HERO_FEED[i % HERO_FEED.length];
    i++;
    const item = feedItem(d);
    setTyping(item);
    list.append(item);
    count.textContent = "1";
    gsap.from(item, { opacity: 0, y: 24, scale: 0.97, duration: 0.5, ease: "power3.out" });

    const extra = list.children.length - MAX;
    if (extra > 0) {
      const old = Array.from(list.children).slice(0, extra);
      gsap.to(old, {
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: -12,
        borderWidth: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => old.forEach((o) => o.remove()),
      });
    }

    timer = gsap.delayedCall(1.3, () => {
      setDone(item);
      count.textContent = "0";
      gsap.fromTo(count.parentElement, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
      timer = gsap.delayedCall(1.1, () => running && step());
    });
  }

  // Seed with three answered items so it never looks empty.
  HERO_FEED.slice(0, 3).forEach((d) => {
    const n = feedItem(d);
    setDone(n);
    list.append(n);
  });
  i = 3;

  ScrollTrigger.create({
    trigger: ".hero",
    start: "top bottom",
    end: "bottom top",
    onToggle(self) {
      running = self.isActive;
      if (running && !timer?.isActive()) gsap.delayedCall(1.2, () => running && step());
      if (!running) timer?.kill();
    },
  });

  // Parallax out
  gsap.to(".hero__copy", {
    yPercent: -12,
    opacity: 0.2,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__glow", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

/* ---------------------------------------------------------------- 02 problem */

function initProblem() {
  const wrap = $("#problemBubbles");
  const bubbles = PROBLEM_BUBBLES.map((b) => {
    const n = el("div", "bubble", `<span class="dot" style="--c:${CH[b.ch].color}"></span>${b.t}`);
    n.style.left = b.x + "%";
    n.style.top = b.y + "%";
    gsap.set(n, { rotation: b.r });
    wrap.append(n);
    return n;
  });
  const countEl = $("#problemCount");
  const pill = $(".problem__counter");

  if (REDUCED) return;

  const counter = { v: 0 };
  const renderCount = () => {
    countEl.textContent = Math.round(counter.v);
    const clear = tl.progress() > 0.85;
    pill.classList.toggle("pill--red", !clear);
    pill.classList.toggle("pill--lime", clear);
    $(".dot", pill).style.setProperty("--c", clear ? "var(--lime)" : "var(--red)");
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    onUpdate: () => renderCount(),
    scrollTrigger: {
      trigger: ".problem",
      start: "top top",
      end: () => "+=" + window.innerHeight * 1.6,
      pin: ".problem__stage",
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: renderCount,
    },
  });

  tl.from(".problem__copy", { opacity: 0.2, scale: 0.94, duration: 0.15 }, 0)
    .from(
      bubbles,
      {
        opacity: 0,
        scale: 0.5,
        y: 60,
        duration: 0.12,
        ease: "back.out(2)",
        stagger: { each: 0.035, from: "random" },
      },
      0.02
    )
    .to(counter, { v: 47, duration: 0.55, ease: "power1.in", onUpdate: renderCount }, 0.02)
    // jitter: messages keep piling — they slowly drift
    .to(bubbles, { y: "-=18", duration: 0.5, stagger: { each: 0.01, from: "random" } }, 0.15)
    .from(".problem__line", { scaleX: 0, duration: 0.12 }, 0.66)
    .from(".problem__turn-text, .problem__turn svg", { opacity: 0, y: 16, duration: 0.08 }, 0.72)
    // Aloai sweeps them away
    .to(
      bubbles,
      {
        left: "50%",
        top: "92%",
        scale: 0.2,
        opacity: 0,
        rotation: 0,
        duration: 0.14,
        ease: "power2.in",
        stagger: { each: 0.006, from: "edges" },
      },
      0.8
    )
    .to(counter, { v: 0, duration: 0.12, ease: "power2.in" }, 0.8)
    .to(".problem__copy", { opacity: 0.35, duration: 0.1 }, 0.86);
}

/* ---------------------------------------------------------------- 03 channels */

function initChannels() {
  reveal($(".channels"));
  batchReveal(".ch-card", { y: 30 });
  batchReveal(".inbox__list li", { y: 20 });

  const voiceText = $(".voice__text");
  if (REDUCED) {
    voiceText.classList.add("is-done");
    return;
  }

  const paths = $$(".flow-path");
  const dots = $$(".flow-dot");
  paths.forEach((p) => {
    p.setAttribute("pathLength", "1");
    gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 });
  });
  gsap.set(dots, { opacity: 0 });

  gsap.to(paths, {
    strokeDashoffset: 0,
    ease: "none",
    stagger: 0.08,
    scrollTrigger: { trigger: ".channels__grid", start: "top 80%", end: "center 55%", scrub: 0.8 },
  });
  gsap.from(".hub", {
    scale: 0,
    rotate: -90,
    ease: "back.out(2)",
    duration: 0.9,
    scrollTrigger: { trigger: ".channels__grid", start: "top 60%", once: true },
  });

  // Messages travel along the lines and pulse the hub on arrival.
  const travel = gsap.timeline({ paused: true });
  dots.forEach((d, idx) => {
    travel.add(
      gsap.fromTo(
        d,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 2.2,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 0.6,
          motionPath: { path: paths[idx], autoRotate: false },
          onRepeat: () => gsap.fromTo(".hub", { scale: 1.12 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }),
        }
      ),
      idx * 0.55
    );
  });

  // Voice note: waveform dances, then the transcript types itself.
  const wave = gsap.to(".ch-card--voice .wave i", {
    scaleY: 0.35,
    duration: 0.35,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.06, from: "center" },
    paused: true,
  });
  let typed = false;

  ScrollTrigger.create({
    trigger: ".channels__grid",
    start: "top 70%",
    end: "bottom top",
    onToggle(self) {
      if (self.isActive) {
        travel.play();
        wave.play();
        if (!typed) {
          typed = true;
          typeTween(voiceText, voiceText.dataset.type, {
            delay: 1.2,
            duration: 1,
            onComplete: () => voiceText.classList.add("is-done"),
          });
        }
      } else {
        travel.pause();
        wave.pause();
      }
    },
  });
}

/* ---------------------------------------------------------------- 04 platform */

function initPlatform() {
  const app = $(".app");
  const chips = $$(".chip", $(".platform"));
  const caption = $("#stepCaption");
  let current = -1;

  const setStep = (i) => {
    if (i === current) return;
    current = i;
    app.dataset.active = i;
    chips.forEach((c, k) => c.classList.toggle("is-active", k === i));
    gsap.fromTo(caption, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 });
    caption.textContent = PLATFORM_CAPTIONS[i];
  };

  if (REDUCED) {
    delete app.dataset.active;
    return;
  }

  const build = () => {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.from(".app__row", { x: -24, opacity: 0, duration: 0.12, stagger: 0.03 }, 0.02)
      .from(".copilot", { y: 30, opacity: 0, duration: 0.08, ease: "power2.out" }, 0.27)
      .add(typeTween($(".copilot__text"), $(".copilot__text").dataset.type, { duration: 0.16 }), 0.33)
      .from(".copilot__actions", { opacity: 0, y: 8, duration: 0.04 }, 0.48);
    $$("[data-fill]").forEach((dd, k) => tl.add(typeTween(dd, dd.dataset.fill, { duration: 0.06 }), 0.52 + k * 0.06));
    tl.from(".lead-status", { scale: 0, opacity: 0, duration: 0.05, ease: "back.out(2)" }, 0.7);
    $$(".kpis [data-count]").forEach((b, k) =>
      tl.add(countTween(b, +b.dataset.count, { duration: 0.14, ease: "none" }), 0.78 + k * 0.03)
    );
    tl.to({}, { duration: 0.04 }); // hold at the end
    return tl;
  };

  const onUpdate = (self) => setStep(Math.min(3, Math.floor(self.progress * 4 * 0.999)));

  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    const tl = build();
    ScrollTrigger.create({
      animation: tl,
      trigger: ".platform",
      start: "top top",
      end: () => "+=" + window.innerHeight * 3,
      pin: ".platform__stage",
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate,
    });
  });
  mm.add(MOBILE, () => {
    const tl = build();
    ScrollTrigger.create({ animation: tl, trigger: ".app", start: "top 85%", end: "bottom 35%", scrub: 0.6, onUpdate });
  });
  setStep(0);
}

/* ---------------------------------------------------------------- 05 demo */

function initDemo() {
  const sources = $$(".source");
  if (REDUCED) return;

  const msgs = $$("#demoChat .msg");
  msgs.forEach((m) => (m.style.overflow = "hidden"));

  const build = () => {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    const labels = [];
    [0, 1, 2].forEach((k) => {
      const [q, a] = msgs.filter((m) => m.dataset.src === String(k));
      const at = 0.04 + k * 0.3;
      tl.add(growIn(q, { duration: 0.07 }), at);
      if (k === 0) {
        tl.fromTo($$(".wave i", q), { scaleY: 0.2 }, { scaleY: 1, duration: 0.05, stagger: 0.004 }, at + 0.05);
        tl.from(".transcript", { opacity: 0, y: 6, duration: 0.04 }, at + 0.1);
      }
      tl.addLabel("s" + k, at + 0.14);
      labels.push(at + 0.14);
      tl.add(growIn(a, { duration: 0.07 }), at + 0.14);
    });
    tl.to({}, { duration: 0.1 });
    return { tl, labels };
  };

  const highlight = (tl, labels) => () => {
    const t = tl.time();
    let active = -1;
    labels.forEach((l, k) => t >= l && (active = k));
    sources.forEach((s, k) => s.classList.toggle("is-on", k === active));
  };

  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    const { tl, labels } = build();
    ScrollTrigger.create({
      animation: tl,
      trigger: ".demo",
      start: "top top",
      end: () => "+=" + window.innerHeight * 2.4,
      pin: ".demo__stage",
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: highlight(tl, labels),
    });
  });
  mm.add(MOBILE, () => {
    const { tl, labels } = build();
    ScrollTrigger.create({
      animation: tl,
      trigger: ".phone",
      start: "top 80%",
      end: "bottom 30%",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: highlight(tl, labels),
    });
  });
}

/* ---------------------------------------------------------------- 06 how */

function initHow() {
  reveal($(".how"));
  batchReveal(".how-card", { y: 60 });
  if (REDUCED) return;

  const minEl = $("#setupMin");
  gsap.fromTo(
    "#setupBar",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".how__grid",
        start: "top 85%",
        end: "bottom 55%",
        scrub: 0.5,
        onUpdate: (self) => (minEl.textContent = Math.round(self.progress * 15)),
      },
    }
  );

  const fileBar = $(".file-bar");
  const pct = $(".file-pct");
  const pp = { v: 0 };
  gsap.set(fileBar, { scaleX: 0 });
  gsap.set(".learned", { opacity: 0 });

  const tl = gsap.timeline({ paused: true, delay: 0.3 });
  $$(".switch").forEach((s, k) => tl.call(() => s.classList.add("is-on"), null, 0.2 + k * 0.35));
  tl.to(".learned", { opacity: 1, duration: 0.3, stagger: 0.3 }, 0.4)
    .to(fileBar, { scaleX: 0.68, duration: 1.4, ease: "power2.out" }, 0.9)
    .to(pp, { v: 68, duration: 1.4, ease: "power2.out", onUpdate: () => (pct.textContent = Math.round(pp.v) + "%") }, 0.9)
    .from(".how-card__vis--chat .msg--out", { opacity: 0, y: 12, duration: 0.4 }, 0.6)
    .from(".how-card__vis--chat .msg--in", { opacity: 0, y: 12, duration: 0.4 }, 1.2)
    .from(".ai-done", { opacity: 0, duration: 0.3 }, 1.6)
    .from(".notify", { opacity: 0, y: 20, scale: 0.95, duration: 0.5, ease: "back.out(2)" }, 1.4)
    .to(".notify", { keyframes: { x: [0, -5, 5, -3, 3, 0] }, duration: 0.5 }, 1.95);

  ScrollTrigger.create({ trigger: ".how__grid", start: "top 70%", once: true, onEnter: () => tl.play() });
}

/* ---------------------------------------------------------------- 07 handoff */

function initHandoff() {
  const steps = $$(".ho-step");
  const owner = $(".ho-owner");
  const ai = $(".ho-ai");
  const complaint = $(".ho-complaint");
  if (REDUCED) return;

  owner.classList.add("is-ai");
  const g = (k) => $$(`[data-h="${k}"]`);
  g(0).concat(g(1)).concat(g(2)).forEach((m) => (m.style.overflow = "hidden"));

  const build = () => {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.add(growIn(g(0)[0], { duration: 0.08 }), 0.04)
      .add(growIn(g(0)[1], { duration: 0.08 }), 0.14)
      .add(growIn(complaint, { duration: 0.08 }), 0.32)
      .add(growIn(".ho-signal", { duration: 0.06 }), 0.44)
      .from(".ho-signal span", { scaleX: 0, duration: 0.08 }, 0.48)
      .add(growIn(".ho-muted", { duration: 0.06 }), 0.62)
      .add(growIn(".msg--human", { duration: 0.1 }), 0.7)
      .to({}, { duration: 0.12 });
    return tl;
  };

  const sync = (tl) => () => {
    const t = tl.time();
    const phase = t >= 0.7 ? 2 : t >= 0.4 ? 1 : t >= 0.1 ? 0 : -1;
    steps.forEach((s, k) => s.classList.toggle("is-on", k <= phase));
    complaint.classList.toggle("is-flag", phase >= 1);
    ai.classList.toggle("is-dim", phase >= 2);
    const human = phase >= 2;
    owner.classList.toggle("is-ai", !human);
    owner.textContent = human ? "Menecer: Nigar H." : "AI aktiv";
  };

  const mm = gsap.matchMedia();
  mm.add(DESKTOP, () => {
    const tl = build();
    ScrollTrigger.create({
      animation: tl,
      trigger: ".handoff",
      start: "top top",
      end: () => "+=" + window.innerHeight * 1.8,
      pin: ".handoff__stage",
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: sync(tl),
    });
  });
  mm.add(MOBILE, () => {
    const tl = build();
    ScrollTrigger.create({
      animation: tl,
      trigger: ".ho-chat",
      start: "top 80%",
      end: "bottom 35%",
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: sync(tl),
    });
  });
}

/* ---------------------------------------------------------------- 08 sectors */

function initSectors() {
  reveal($(".sectors"));
  const tabsEl = $("#sectorTabs");
  const chat = $("#sectorChat");
  const outEl = $("#sectorOutcomes");
  const DURATION = 7;
  let active = 0;
  let progress = null;
  let inView = false;
  let hovering = false;

  const tabs = SECTORS.map((s, k) => {
    const b = el("button", "tab", `${s.name}<span class="tab__bar"><span></span></span>`);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.id = "tab-" + k;
    b.setAttribute("aria-controls", "sectorChat");
    b.addEventListener("click", () => select(k, true));
    b.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const n = (k + (e.key === "ArrowRight" ? 1 : -1) + SECTORS.length) % SECTORS.length;
        tabs[n].focus();
        select(n, true);
      }
    });
    tabsEl.append(b);
    return b;
  });

  const outcomes = SECTORS.map((s, k) => {
    const b = el(
      "button",
      "outcome",
      `<b>${s.name}</b><span>${s.q}</span><small class="${s.amber ? "amber" : ""}">${s.amber ? "→" : "✓"} ${s.result}</small>`
    );
    b.type = "button";
    b.addEventListener("click", () => select(k, true));
    outEl.append(b);
    return b;
  });

  function render(k) {
    const s = SECTORS[k];
    const c = CH[s.ch];
    chat.innerHTML = "";
    chat.setAttribute("aria-labelledby", "tab-" + k);
    chat.append(el("span", "sector-chat__ch", c.label.toUpperCase()));
    chat.lastChild.style.color = c.color;
    const nodes = s.msgs.map(([dir, t], i) => {
      const m = el("div", `msg msg--${dir === "out" ? "out" : "in"}${dir === "in" && i === 1 ? " msg--ai" : ""}`);
      m.textContent = t;
      chat.append(m);
      return m;
    });
    const res = el("div", "result" + (s.amber ? " result--amber" : ""), `${s.amber ? "" : CHECK_SVG}${s.result}`);
    chat.append(res);

    if (REDUCED) return;
    const tl = gsap.timeline();
    tl.from(chat.firstChild, { opacity: 0, duration: 0.3 });
    nodes.forEach((m, i) => tl.from(m, { opacity: 0, y: 14, scale: 0.98, duration: 0.4, ease: "power2.out" }, 0.15 + i * 0.75));
    tl.from(res, { opacity: 0, y: 10, scale: 0.9, duration: 0.45, ease: "back.out(2)" }, 0.15 + nodes.length * 0.75);
  }

  function runProgress() {
    progress?.kill();
    const bar = $(".tab__bar > span", tabs[active]);
    gsap.set(bar, { scaleX: 0, opacity: 1 });
    if (REDUCED) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }
    progress = gsap.to(bar, {
      scaleX: 1,
      duration: DURATION,
      ease: "none",
      paused: !inView || hovering,
      onComplete: () => select((active + 1) % SECTORS.length, false),
    });
  }

  function select(k, user) {
    tabs[active].classList.add("is-seen");
    gsap.set($(".tab__bar > span", tabs[active]), { scaleX: 1, opacity: 0.35 });
    active = k;
    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", String(i === k));
      t.tabIndex = i === k ? 0 : -1;
      if (i === k) t.classList.remove("is-seen");
    });
    outcomes.forEach((o, i) => o.classList.toggle("is-active", i === k));
    render(k);
    runProgress();
    if (user) inView = true;
  }

  select(0, false);

  ScrollTrigger.create({
    trigger: ".sectors__grid",
    start: "top 75%",
    end: "bottom 20%",
    onToggle(self) {
      inView = self.isActive;
      if (inView && !hovering) progress?.play();
      else progress?.pause();
    },
    onEnter: () => render(active),
  });

  chat.addEventListener("pointerenter", () => {
    hovering = true;
    progress?.pause();
  });
  chat.addEventListener("pointerleave", () => {
    hovering = false;
    if (inView) progress?.play();
  });
}

/* ---------------------------------------------------------------- 09–12 */

function initTrust() {
  reveal($(".trust"));
  batchReveal(".trust-card", { y: 40 });
  if (REDUCED) return;
  $$(".trust [data-count]").forEach((n) => {
    n.textContent = "0";
    ScrollTrigger.create({
      trigger: n,
      start: "top 85%",
      once: true,
      onEnter: () => countTween(n, +n.dataset.count, { duration: 1.4 }),
    });
  });
}

function initPricing() {
  reveal($(".pricing"));
  batchReveal(".plan", { y: 70 });
  batchReveal(".corp", { y: 30 });
}

function initFaq() {
  reveal($(".faq"));
  batchReveal(".faq-item", { y: 30 });
}

function initCta() {
  if (REDUCED) return;
  const countEl = $(".cta-count b");
  const tl = gsap.timeline({ paused: true });
  tl.from(".cta-q", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" })
    .from(".cta-count", { opacity: 0, scale: 0.8, duration: 0.4 }, "<")
    .from(".cta-a", { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, "+=0.9")
    .call(() => {
      countEl.textContent = "0";
      gsap.fromTo(".cta-count", { scale: 1.2 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    })
    .from(".cta__title", { opacity: 0, y: 40, duration: 0.9, ease: "power3.out" }, 0.2)
    .from(".cta .lead, .cta .btn-row", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 0.45);
  ScrollTrigger.create({ trigger: ".cta", start: "top 65%", once: true, onEnter: () => tl.play() });
}

/* ---------------------------------------------------------------- boot */

function init() {
  if (REDUCED) showFinalStates();
  initScroll();
  initHero();
  initProblem();
  initChannels();
  initPlatform();
  initDemo();
  initHow();
  initHandoff();
  initSectors();
  initTrust();
  initPricing();
  initFaq();
  initCta();
  initActiveNav();
  initMagnetic();
  initTilt();

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

init();
