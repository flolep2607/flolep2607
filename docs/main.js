(() => {
  /**
   * Location-specific copy (client-side, not access control).
   * Unknown geo → Auckland default. Preview: ?audience=nz|stealth|france|australia|us|default|blocked
   * AS56030 is Voyager (ISP). Do not match the whole ASN.
   */
  const CONFIG = {
    // Specific /64 only. Do not widen to the ISP ASN.
    employerCidrs: [
      "2406:1e00:b910:a600::/64",
    ],
    // Left empty on purpose. AS56030 is Voyager (ISP).
    employerAsns: [
      // 56030  // ← do not enable whole-ISP matching
    ],
    geoApi: "https://get.geojs.io/v1/ip/geo.json",
    geoTimeoutMs: 2500,
  };

  const RECRUIT_COUNTRIES = new Set([
    "CH", "NO", "IE", "DK", "FI", "IS", "SE",
    "AU", "NL", "LU", "BE",
    "JP", "AT", "CA", "US",
    "EE", "CZ", "FR", "SI", "SG",
    "IL", "LT", "ES", "PT", "IT", "MT", "LV",
    "KR",
    "RU",
    "MC", "AD", "LI",
  ]);

  const BLOCKED_COUNTRIES = new Set([
    "IN", "PK", "BD",
    "GB", "DE",
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD",
    "CI", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "KE",
    "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG",
    "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG",
    "ZM", "ZW", "EH", "SH",
  ]);

  const FORCED_AUDIENCE = {
    stealth: "stealth",
    nz: "nz",
    oceania: "oceania",
    blocked: "blocked",
    france: "france",
    australia: "australia",
    au: "australia",
    us: "us",
    usa: "us",
    default: "default",
  };

  const PRIMARY = {
    origin: "https://me.flolep.fr",
    health: "https://me.flolep.fr/health",
    timeoutMs: 2200,
  };

  const params = new URLSearchParams(location.search);
  const skipFallback =
    params.has("nofallback") ||
    params.get("fallback") === "1" ||
    localStorage.getItem("flolep-nofallback") === "1";

  const banner = document.getElementById("fallback-banner");
  const typed = document.getElementById("typed");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let currentAudience = "nz";
  let currentLang = "en";
  let stopTyping = null;

  const I18N = {
    en: {
      "nav.now": "Now",
      "nav.work": "Work",
      "nav.school": "School",
      "nav.vault": "Vault",
      "nav.tools": "Tools",
      "nav.contact": "Contact",
      "nav.recruit": "Hire",
      "fallback.forced": "Forced fallback mode (?nofallback).",
      "fallback.stealth": "Cold portfolio view.",
      "fallback.unhealthy": "me.flolep.fr health check failed — serving the mirror.",
      "fallback.down": "me.flolep.fr looks offline — you’re on the GitHub Pages copy.",
      "fallback.stay": "stay here",
      "fallback.title": "Fallback mirror",
      "hero.lede": "Engineer at <strong>Xtracta</strong> in Auckland. I build systems that have to be fast, observable and hard to surprise — mostly in <strong>Rust</strong> and <strong>Python</strong>. <strong>Grenoble INP · ESISAR P25</strong>, IRC (CS, networks, cybersecurity) — CTI-accredited, master’s-equivalent, ANSSI SecNumedu.",
      "loc.quiet": "Based in <strong>Auckland</strong>.",
      "loc.oceania": "Based in <strong>Auckland</strong>.",
      "loc.france": "ESISAR <strong>P25</strong> · open to a <strong>CDI in France</strong> / remote EU.",
      "loc.australia": "French citizen in Auckland — open to <strong>Australia</strong> (Sydney / Melbourne / remote).",
      "loc.us": "French citizen in Auckland — open to <strong>US</strong> teams that sponsor.",
      "loc.default": "Open to <strong>Australia</strong>, the <strong>US</strong>, and <strong>France</strong>.",
      "loc.stealth": "Engineer at Xtracta. Systems work in Rust and Python.",
      "now.eyebrow": "Now",
      "now.lede": "<strong>Engineer</strong>, Auckland — since <strong>September 2025</strong> (end-of-studies internship, then hired).",
      "now.dt1": "Role",
      "now.dd1": "Engineer",
      "now.dt2": "Since",
      "now.dd2": "September 2025",
      "now.dt3": "Where",
      "now.dt4": "School",
      "now.dd4": "ESISAR P25",
      "manifold.eyebrow": "Flagship · core contributor",
      "manifold.body": "Backtesting engine for quantitative research. Strategies in a fluent Python DSL, compiled into an optimised Rust expression graph, executed vectorised.",
      "manifold.m1": "<strong>500K</strong> bars in ~26&nbsp;ms",
      "manifold.m2": "<strong>161×</strong> faster than vectorbt",
      "manifold.m3": "<strong>pip</strong> install — no Rust toolchain",
      "manifold.note": "I wrote effectively all of the next version — engine, DSL surface and validation tooling — currently unreleased. Large Rust codebases and adversarial edge-cases are the same muscles cybersecurity work uses.",
      "manifold.web": "Website",
      "manifold.repo": "Repository",
      "work.eyebrow": "Public work",
      "work.title": "Things that ship",
      "cctop.p": "htop for AI coding agents. One screen for every Claude Code, Codex, Cursor, Gemini session — cost, context, who’s waiting. Musl builds, doctor, live hooks.",
      "thermal.p": "No heater at home — so this maxes GPU watts until the room warms up. Autotunes GEMM per card, holds every GPU under a temperature cap.",
      "tvdata.p": "<code>pip install TvData</code> — bulk candle data into Pandas, chunked, mypy-friendly, CI-released.",
      "git.p": "AI commit agent from before the category existed.",
      "also.title": "Also",
      "also.meta": "Open source",
      "recruit.eyebrow": "Hire",
      "recruit.fr.title": "Open to a CDI in France",
      "recruit.fr.lede": "ESISAR P25 engineer, IRC track (ANSSI SecNumedu). Currently in Auckland. Detection, AppSec / DevSecOps, or systems. French citizen — defence clearance / CDII eligible.",
      "recruit.au.title": "Open to Australia",
      "recruit.au.lede": "Software / security engineer. CTI diplôme d’ingénieur (master’s-equivalent, AQF 9). IRC: CS, networks, cybersecurity. Currently in Auckland. Open to 482 sponsorship — Sydney, Melbourne, or remote AU.",
      "recruit.us.title": "Open to US teams that sponsor",
      "recruit.us.lede": "French citizen, currently in Auckland. CTI engineering degree (typically WES master’s-equivalent). Production systems in Rust and Python. Software, platform, or security engineering at teams that sponsor.",
      "recruit.default.title": "Open to Australia, the US, and France",
      "recruit.default.lede": "ESISAR P25 · IRC · SecNumedu. Engineer in Auckland. Detection, AppSec, or security-minded systems — also a strong Rust/Python seat.",
      "cyber.eyebrow": "IRC · the whole track",
      "cyber.title": "What IRC actually covers",
      "cyber.lede": "ESISAR is an embedded-systems school. IRC is the CS + networks + cybersecurity track. The public work is the overlap: low-level code, networks you can actually run, and systems that fail loudly instead of quietly.",
      "cyber.s1": "Systems &amp; low-level",
      "cyber.s1p": "Rust engines, C, CUDA binaries, musl static builds",
      "cyber.s2": "Networks",
      "cyber.s2p": "TCP/IP, DNS, WireGuard, Cloudflare tunnels, proxy-aware collectors",
      "cyber.s5": "Cybersecurity",
      "cyber.s5p": "ANSSI SecNumedu track · threat modelling, hardening, OSINT, detection-shaped habits",
      "cyber.s6": "Embedded",
      "cyber.s6p": "ESISAR DNA: C, hexapod gait lab, CUDA, hardware-aware software",
      "cyber.s3": "Data &amp; agents",
      "cyber.s3p": "cctop (Rust TUI for AI coding agents), typed Python pipelines, PyPI releases",
      "cyber.s4": "Adversarial thinking",
      "cyber.s4p": "Lookahead detection, latency races, edge-case hunting — same habit as threat modelling",
      "school.eyebrow": "Education",
      "school.title": "Grenoble INP — ESISAR",
      "school.lede": "CTI-accredited <strong>diplôme d’ingénieur</strong> (5 years, 300 ECTS) — master’s-equivalent. Promo <strong>P25</strong>. Track: <strong>Computer Science, Networks and Cybersecurity (IRC)</strong>, labelled <strong>ANSSI SecNumedu</strong> — August 2025.",
      "school.dt1": "School",
      "school.dt2": "Degree",
      "school.dd2": "CTI · master’s-eq.",
      "school.dt3": "Track",
      "school.dd3": "August 2025",
      "school.dt4": "English",
      "school.dd4": "TOEIC 925 / 990",
      "vault.eyebrow": "Private catalogue",
      "vault.title": "Behind the wall",
      "vault.lede": "~75 private repositories — no links. Boring infrastructure, trading systems, and the kind of curiosity that stays private on purpose.",
      "vault.h1": "Collection &amp; analysis",
      "vault.h2": "Systems &amp; trading",
      "vault.h3": "Infrastructure",
      "vault.h4": "Products",
      "vault.l1": "OSINT service — FastAPI, scheduled collectors",
      "vault.l2": "Macro / market data with auth and rate limits",
      "vault.l3": "Vehicle market scraper — Postgres + Grafana",
      "vault.l4": "Rust listing detector — millisecond budget, musl",
      "vault.l5": "On-chain arb on HyperEVM — Rust + Solidity",
      "vault.l6": "Cross-venue detection · RL · self-play poker",
      "vault.l7": "Discord-backed filesystem — JS, then Rust",
      "vault.l8": "LLM proxy on Cloudflare Workers",
      "vault.l9": "Media stack behind WireGuard + tunnels",
      "vault.l10": "Japan trip planner — Vue · Fastify · Gemini",
      "vault.l11": "Recipe manager · Flutter radar alerts",
      "vault.l12": "Godot jam · CS:GO trade-up EV (WASM)",
      "vault.note": "Happy to walk through the polite half in a conversation. The rest stays cold.",
      "stack.eyebrow": "Toolbox",
      "stack.title": "Stack",
      "stack.lede": "Daily drivers first. Everything else shows up when the problem asks for it — not when a skill-matrix spreadsheet does.",
      "stack.h1": "Daily",
      "stack.h2": "Networks &amp; infra",
      "stack.h3": "Also",
      "tools.eyebrow": "Deployed",
      "tools.title": "Live on flolep.fr",
      "tools.radar": "French speed-camera map",
      "tools.anime": "Search across ~50 VOSTFR/VF sources",
      "tools.vignette": "Contrôle technique sticker regen",
      "tools.0x40": "PWA · sound + strobe",
      "tools.osu": "Click circles in the browser",
      "tools.hq": "Pixel-art homepage · CRT toggle",
      "contact.eyebrow": "Contact",
      "contact.title": "Open to a CDI in France",
      "contact.calm": "Public work, school, and the bits that are allowed on the internet.",
      "contact.seek": "ESISAR P25, engineer in Auckland. Detection, AppSec, security-minded systems — or a strong Rust/Python seat. The threat model isn’t a slideshow.",
      "contact.oceania": "Public work, school, and the bits that are allowed on the internet.",
      "contact.france": "ESISAR P25, engineer in Auckland. Detection, AppSec, security-minded systems — or a strong Rust/Python seat.",
      "stealth.eyebrow": "Links",
      "stealth.title": "Elsewhere",
      "stealth.lede": "Selected public work and experiments.",
      "footer.sub": "GitHub Pages mirror · primary host me.flolep.fr · private work stays in the vault",
      "bar.systems": "systems",
      "bar.networks": "networks",
      "bar.cyber": "cyber",
      "bar.rust": "rust",
      "git.meta": "Python · since Dec 2022",
    },
    fr: {
      "nav.now": "Poste",
      "nav.work": "Projets",
      "nav.school": "École",
      "nav.vault": "Privé",
      "nav.tools": "Outils",
      "nav.contact": "Contact",
      "nav.recruit": "Recrutement",
      "fallback.forced": "Mode miroir forcé (?nofallback).",
      "fallback.stealth": "Vue portfolio discrète.",
      "fallback.unhealthy": "Le contrôle de me.flolep.fr a échoué — miroir servi ici.",
      "fallback.down": "me.flolep.fr a l’air hors ligne — vous êtes sur la copie GitHub Pages.",
      "fallback.stay": "rester ici",
      "fallback.title": "Miroir de secours",
      "hero.lede": "Ingénieur chez <strong>Xtracta</strong> à Auckland. Je construis des systèmes qui doivent être rapides, observables et difficiles à surprendre — surtout en <strong>Rust</strong> et <strong>Python</strong>. <strong>Grenoble INP · ESISAR P25</strong>, filière IRC (informatique, réseaux, cybersécurité) — diplôme CTI, équivalent master, label ANSSI SecNumedu.",
      "loc.quiet": "Basé à <strong>Auckland</strong>.",
      "loc.oceania": "Basé à <strong>Auckland</strong>.",
      "loc.france": "ESISAR <strong>P25</strong> · ouvert à un <strong>CDI en France</strong> / télétravail UE.",
      "loc.australia": "Français à Auckland — ouvert à l’<strong>Australie</strong> (Sydney, Melbourne ou télétravail).",
      "loc.us": "Français à Auckland — ouvert aux équipes <strong>américaines</strong> qui portent le visa.",
      "loc.default": "Ouvert à l’<strong>Australie</strong>, aux <strong>États-Unis</strong> et à la <strong>France</strong>.",
      "loc.stealth": "Ingénieur chez Xtracta. Systèmes en Rust et Python.",
      "now.eyebrow": "En poste",
      "now.lede": "<strong>Ingénieur</strong>, Auckland — depuis <strong>septembre 2025</strong> (stage de fin d’études, puis embauché).",
      "now.dt1": "Poste",
      "now.dd1": "Ingénieur",
      "now.dt2": "Depuis",
      "now.dd2": "Septembre 2025",
      "now.dt3": "Lieu",
      "now.dt4": "École",
      "now.dd4": "ESISAR P25",
      "manifold.eyebrow": "Projet phare · contributeur principal",
      "manifold.body": "Moteur de backtest pour la recherche quantitative. Les stratégies s’écrivent dans un DSL Python, compilées en graphe d’expressions Rust, exécutées de façon vectorisée.",
      "manifold.m1": "<strong>500K</strong> bougies en ~26&nbsp;ms",
      "manifold.m2": "<strong>161×</strong> plus rapide que vectorbt",
      "manifold.m3": "<strong>pip</strong> install — sans toolchain Rust",
      "manifold.note": "J’ai écrit l’essentiel de la prochaine version — moteur, DSL et outils de validation — pas encore publiée. Gros dépôts Rust et chasse aux cas limites : les mêmes réflexes qu’en cyber.",
      "manifold.web": "Site",
      "manifold.repo": "Dépôt",
      "work.eyebrow": "Travail public",
      "work.title": "Ce qui est en prod",
      "cctop.p": "Un htop pour agents de code IA. Un écran pour chaque session Claude Code, Codex, Cursor, Gemini — coût, contexte, qui attend. Binaires musl, doctor, hooks en direct.",
      "thermal.p": "Pas de chauffage chez moi : ça pousse les watts GPU jusqu’à ce que la pièce chauffe. Réglage auto du GEMM par carte, sous un plafond de température.",
      "tvdata.p": "<code>pip install TvData</code> — bougies en masse vers Pandas, par paquets, typé mypy, publié en CI.",
      "git.p": "Agent de commit IA, avant que ça soit une catégorie.",
      "also.title": "Aussi",
      "also.meta": "Open source",
      "recruit.eyebrow": "Recrutement",
      "recruit.fr.title": "Ouvert à un CDI en France",
      "recruit.fr.lede": "Ingénieur ESISAR P25, filière IRC (ANSSI SecNumedu). En poste à Auckland. Détection, AppSec / DevSecOps, ou systèmes. Citoyen français — habilitation défense / CDII.",
      "recruit.au.title": "Ouvert à l’Australie",
      "recruit.au.lede": "Ingénieur logiciel / cybersécurité. Diplôme d’ingénieur CTI (équivalent master, AQF 9). Filière IRC : informatique, réseaux, cybersécurité. En poste à Auckland. Ouvert à un visa 482 — Sydney, Melbourne ou télétravail en Australie.",
      "recruit.us.title": "Ouvert aux équipes US qui portent un visa",
      "recruit.us.lede": "Citoyen français, actuellement à Auckland. Diplôme d’ingénieur CTI (en général équivalent master WES). Systèmes en production en Rust et Python. Développement, plateforme ou cybersécurité, chez des équipes qui portent le visa.",
      "recruit.default.title": "Ouvert à l’Australie, aux États-Unis et à la France",
      "recruit.default.lede": "ESISAR P25 · IRC · SecNumedu. Ingénieur à Auckland. Détection, AppSec, ou systèmes pensés sécu — aussi un vrai poste Rust / Python.",
      "cyber.eyebrow": "IRC · la filière",
      "cyber.title": "Ce que couvre vraiment l’IRC",
      "cyber.lede": "L’ESISAR est une école de systèmes embarqués. L’IRC, c’est la filière informatique, réseaux et cybersécurité. Le travail public, c’est le recouvrement : du bas niveau, des réseaux qu’on fait tourner vraiment, et des systèmes qui crient au lieu de se taire.",
      "cyber.s1": "Systèmes et bas niveau",
      "cyber.s1p": "Moteurs Rust, C, binaires CUDA, builds musl statiques",
      "cyber.s2": "Réseaux",
      "cyber.s2p": "TCP/IP, DNS, WireGuard, tunnels Cloudflare, collecteurs qui gèrent les proxies",
      "cyber.s5": "Cybersécurité",
      "cyber.s5p": "Filière ANSSI SecNumedu · modélisation de menaces, durcissement, OSINT, réflexes de détection",
      "cyber.s6": "Embarqué",
      "cyber.s6p": "L’ADN ESISAR : C, labo de marche hexapode, CUDA, logiciel qui connaît le matériel",
      "cyber.s3": "Données et agents",
      "cyber.s3p": "cctop (TUI Rust pour agents de code IA), pipelines Python typés, publications PyPI",
      "cyber.s4": "Lecture adverse",
      "cyber.s4p": "Détection de lookahead, courses de latence, chasse aux cas limites — le même réflexe qu’en modélisation de menaces",
      "school.eyebrow": "Formation",
      "school.title": "Grenoble INP — ESISAR",
      "school.lede": "Diplôme d’ingénieur <strong>CTI</strong> (5 ans, 300 ECTS) — équivalent master. Promo <strong>P25</strong>. Filière : <strong>Informatique, Réseaux et Cybersécurité (IRC)</strong>, label <strong>ANSSI SecNumedu</strong> — août 2025.",
      "school.dt1": "École",
      "school.dt2": "Diplôme",
      "school.dd2": "CTI · éq. master",
      "school.dt3": "Filière",
      "school.dd3": "Août 2025",
      "school.dt4": "Anglais",
      "school.dd4": "TOEIC 925 / 990",
      "vault.eyebrow": "Catalogue privé",
      "vault.title": "Derrière le mur",
      "vault.lede": "~75 dépôts privés — pas de liens. De l’infra sans intérêt public, des systèmes de trading, et de la curiosité qui reste privée exprès.",
      "vault.h1": "Collecte et analyse",
      "vault.h2": "Systèmes et trading",
      "vault.h3": "Infrastructure",
      "vault.h4": "Produits",
      "vault.l1": "Service OSINT — FastAPI, collecteurs planifiés",
      "vault.l2": "Données macro / marché avec auth et limites de débit",
      "vault.l3": "Scraper du marché auto — Postgres + Grafana",
      "vault.l4": "Détecteur de listing Rust — budget milliseconde, musl",
      "vault.l5": "Arbitrage on-chain HyperEVM — Rust + Solidity",
      "vault.l6": "Détection multi-places · RL · poker en auto-jeu",
      "vault.l7": "Système de fichiers sur Discord — JS, puis Rust",
      "vault.l8": "Proxy LLM sur Cloudflare Workers",
      "vault.l9": "Stack média derrière WireGuard et tunnels",
      "vault.l10": "Planificateur de voyage au Japon — Vue · Fastify · Gemini",
      "vault.l11": "Recettes · alertes radar Flutter",
      "vault.l12": "Jam Godot · EV trade-up CS:GO (WASM)",
      "vault.note": "Je peux détailler la moitié polie en entretien. Le reste reste privé.",
      "stack.eyebrow": "Boîte à outils",
      "stack.title": "Stack",
      "stack.lede": "D’abord les outils du quotidien. Le reste arrive quand le problème le demande — pas quand un tableur de compétences le fait.",
      "stack.h1": "Quotidien",
      "stack.h2": "Réseaux et infra",
      "stack.h3": "Aussi",
      "tools.eyebrow": "En ligne",
      "tools.title": "En ligne sur flolep.fr",
      "tools.radar": "Carte des radars en France",
      "tools.anime": "Recherche sur ~50 sources VOSTFR / VF",
      "tools.vignette": "Réimpression de vignette CT",
      "tools.0x40": "PWA · son + stroboscope",
      "tools.osu": "Cercles à cliquer dans le navigateur",
      "tools.hq": "Page d’accueil pixel · filtre CRT",
      "contact.eyebrow": "Contact",
      "contact.title": "Ouvert à un CDI en France",
      "contact.calm": "Le travail public, l’école, et ce qui a le droit d’être sur internet.",
      "contact.seek": "ESISAR P25, ingénieur à Auckland. Détection, AppSec, systèmes pensés sécu — ou un vrai poste Rust / Python. Le modèle de menaces n’est pas un PowerPoint.",
      "contact.oceania": "Le travail public, l’école, et ce qui a le droit d’être sur internet.",
      "contact.france": "ESISAR P25, ingénieur à Auckland. Détection, AppSec, systèmes pensés sécu — ou un vrai poste Rust / Python.",
      "stealth.eyebrow": "Liens",
      "stealth.title": "Ailleurs",
      "stealth.lede": "Une sélection de travail public et d’expériences.",
      "footer.sub": "Miroir GitHub Pages · site principal me.flolep.fr · le privé reste au coffre",
      "bar.systems": "systèmes",
      "bar.networks": "réseaux",
      "bar.cyber": "cyber",
      "bar.rust": "rust",
      "git.meta": "Python · depuis déc. 2022",
    },
  };

  const browserPrefersFr = () => {
    const list = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];
    return list.some((l) => String(l).toLowerCase().startsWith("fr"));
  };

  const resolveLang = () => {
    const forced = (params.get("lang") || "").toLowerCase();
    if (forced === "fr" || forced === "en") return forced;
    const stored = (localStorage.getItem("flolep-lang") || "").toLowerCase();
    if (stored === "fr" || stored === "en") return stored;
    // Default English; French only when the browser asks for it.
    return browserPrefersFr() ? "fr" : "en";
  };

  const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;

  const applyLang = (lang) => {
    currentLang = lang === "fr" ? "fr" : "en";
    document.documentElement.lang = currentLang;
    document.documentElement.dataset.lang = currentLang;
    document.body.dataset.lang = currentLang;
    localStorage.setItem("flolep-lang", currentLang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val == null) return;
      if (el.hasAttribute("data-i18n-html")) el.innerHTML = val;
      else el.textContent = val;
    });

    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      const on = btn.getAttribute("data-set-lang") === currentLang;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-active", on);
    });

    applyVisibility();
    if (stopTyping) stopTyping();
    startTyping(currentAudience, currentLang);
  };

  const isQuietAudience = (audience) =>
    audience === "stealth" ||
    audience === "nz" ||
    audience === "oceania" ||
    audience === "blocked";

  const audienceForCountry = (country) => {
    const cc = String(country || "").toUpperCase();
    if (!cc) return "blocked";
    if (cc === "NZ") return "nz";
    // French overseas: geojs sometimes returns the territory code, not FR.
    if (cc === "RE" || cc === "YT" || cc === "GF" || cc === "GP" || cc === "MQ" || cc === "NC" || cc === "PF") {
      return "france";
    }
    if (BLOCKED_COUNTRIES.has(cc) || !RECRUIT_COUNTRIES.has(cc)) return "blocked";
    if (cc === "AU") return "australia";
    if (cc === "US") return "us";
    if (cc === "FR" || cc === "BE" || cc === "CH" || cc === "LU" || cc === "MC" || cc === "AD") {
      return "france";
    }
    return "default";
  };

  const applyVisibility = () => {
    document.querySelectorAll("[data-audience]").forEach((el) => {
      const allowed = el.getAttribute("data-audience").split(/\s+/);
      const audOk = allowed.includes(currentAudience) || allowed.includes("all");
      el.hidden = !audOk;
    });

    const quiet = isQuietAudience(currentAudience);
    document.querySelectorAll("[data-seek]").forEach((el) => {
      if (quiet) {
        el.hidden = true;
        return;
      }
      if (!el.hasAttribute("data-audience")) el.hidden = false;
    });
  };

  const showFallbackBanner = (reason) => {
    if (!banner) return;
    banner.hidden = false;
    banner.dataset.reason = reason || "down";
    const title = banner.querySelector("[data-reason-title]");
    if (title) title.textContent = t("fallback.title");
    const text = banner.querySelector("[data-reason-text]");
    if (text) {
      const key = ({
        forced: "fallback.forced",
        stealth: "fallback.stealth",
        unhealthy: "fallback.unhealthy",
        down: "fallback.down",
      })[reason] || "fallback.down";
      text.textContent = t(key);
    }
    const stay = banner.querySelector("[data-reason-stay]");
    if (stay) stay.textContent = t("fallback.stay");
  };

  const wireLangSwitch = () => {
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.getAttribute("data-set-lang");
        if (next === currentLang) return;
        applyLang(next);
      });
    });
  };

  const parseV4 = (ip) => {
    const p = ip.split(".").map(Number);
    if (p.length !== 4 || p.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
    return Uint8Array.from(p);
  };

  const parseV6 = (ip) => {
    let s = ip.trim().toLowerCase();
    if (s.includes("%")) s = s.split("%")[0];
    if (s.includes(".")) return null;
    const parts = s.split("::");
    if (parts.length > 2) return null;
    const head = parts[0] ? parts[0].split(":") : [];
    const tail = parts.length === 2 && parts[1] ? parts[1].split(":") : [];
    let hextets;
    if (parts.length === 1) {
      if (head.length !== 8) return null;
      hextets = head;
    } else {
      const missing = 8 - head.length - tail.length;
      if (missing < 0) return null;
      hextets = [...head, ...Array(missing).fill("0"), ...tail];
    }
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 8; i++) {
      const n = parseInt(hextets[i], 16);
      if (Number.isNaN(n) || n < 0 || n > 0xffff) return null;
      bytes[i * 2] = (n >> 8) & 0xff;
      bytes[i * 2 + 1] = n & 0xff;
    }
    return bytes;
  };

  const ipToBytes = (ip) => {
    if (!ip) return null;
    if (ip.includes(":")) return parseV6(ip);
    return parseV4(ip);
  };

  const cidrContains = (ip, cidr) => {
    const [base, bitsRaw] = cidr.trim().split("/");
    const bits = Number(bitsRaw);
    const ipB = ipToBytes(ip);
    const baseB = ipToBytes(base);
    if (!ipB || !baseB || ipB.length !== baseB.length) return false;
    const maxBits = ipB.length * 8;
    if (Number.isNaN(bits) || bits < 0 || bits > maxBits) return false;
    if (bits === 0) return true;
    const fullBytes = Math.floor(bits / 8);
    const rem = bits % 8;
    for (let i = 0; i < fullBytes; i++) {
      if (ipB[i] !== baseB[i]) return false;
    }
    if (rem === 0) return true;
    const mask = (0xff << (8 - rem)) & 0xff;
    return (ipB[fullBytes] & mask) === (baseB[fullBytes] & mask);
  };

  const isEmployerIp = (ip, asn) => {
    if (CONFIG.employerCidrs.some((cidr) => cidrContains(ip, cidr.trim()))) return true;
    if (asn == null || !CONFIG.employerAsns.length) return false;
    const n = Number(String(asn).replace(/^AS/i, ""));
    return CONFIG.employerAsns.some((a) => Number(a) === n);
  };

  const fetchGeo = async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CONFIG.geoTimeoutMs);
    try {
      const res = await fetch(CONFIG.geoApi, {
        signal: ctrl.signal,
        cache: "no-store",
        credentials: "omit",
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const resolveAudience = async () => {
    const forced =
      params.get("audience") ||
      localStorage.getItem("flolep-audience") ||
      "";
    const mapped = FORCED_AUDIENCE[String(forced).toLowerCase()];
    if (mapped) {
      return { audience: mapped, ip: null, country: null, asn: null, forced: true };
    }

    const geo = await fetchGeo();
    // Fail closed: unknown country → Auckland default.
    if (!geo) return { audience: "nz", ip: null, country: null, asn: null, forced: false };

    const ip = geo.ip || geo.IPv4 || null;
    const country = (geo.country_code || geo.country || "").toUpperCase();
    const asn = geo.asn || geo.as || geo.organization_name || null;
    const asnNum = geo.asn
      ? String(geo.asn).replace(/^AS/i, "")
      : null;

    console.info("[flolep] visitor", {
      ip,
      country,
      asn: asnNum || asn,
      org: geo.organization_name || geo.org || geo.asn_org || null,
      city: geo.city || null,
    });

    if (ip && isEmployerIp(ip, asnNum)) {
      return { audience: "stealth", ip, country, asn: asnNum, forced: false };
    }

    return {
      audience: audienceForCountry(country),
      ip,
      country,
      asn: asnNum,
      forced: false,
    };
  };

  const applyAudience = (audience) => {
    currentAudience = audience;
    document.documentElement.dataset.audience = audience;
    document.body.dataset.audience = audience;
    applyVisibility();
  };

  const probePrimary = async (audience) => {
    // Keep this copy so location-specific text can run. Same script on me.flolep.fr.
    if (skipFallback) {
      showFallbackBanner("forced");
      return false;
    }
    if (audience === "stealth") {
      showFallbackBanner("stealth");
      return false;
    }
    return false;
  };

  const startTyping = (audience, lang) => {
    if (!typed) return;

    const linesByLang = {
      en: {
        stealth: [
          "Engineer at Xtracta · Rust · Python",
          "Low-latency infrastructure",
          "Networks · Linux · shipping tools",
        ],
        nz: [
          "Engineer at Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust where the latency budget hurts",
        ],
        oceania: [
          "Engineer at Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust where the latency budget hurts",
        ],
        blocked: [
          "Engineer at Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust where the latency budget hurts",
        ],
        france: [
          "Ingénieur ESISAR P25 · IRC · SecNumedu",
          "Open to a CDI in France / remote EU",
          "Rust & Python · systems & detection",
        ],
        australia: [
          "ESISAR P25 · IRC · SecNumedu",
          "Open to Australia — Sydney / Melbourne / remote",
          "Rust & Python · systems & security",
        ],
        us: [
          "French citizen · Auckland · CTI master’s-eq.",
          "Open to US teams that sponsor",
          "Rust & Python · systems & security",
        ],
        default: [
          "Ingénieur ESISAR P25 · IRC",
          "Open to Australia, the US, and France",
          "Rust where the latency budget hurts",
          "Systems that are hard to surprise",
        ],
      },
      fr: {
        stealth: [
          "Ingénieur chez Xtracta · Rust · Python",
          "Infra à basse latence",
          "Réseaux · Linux · outils qui partent en prod",
        ],
        nz: [
          "Ingénieur chez Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust quand le budget latence fait mal",
        ],
        oceania: [
          "Ingénieur chez Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust quand le budget latence fait mal",
        ],
        blocked: [
          "Ingénieur chez Xtracta · Auckland",
          "ESISAR P25 · IRC · SecNumedu",
          "Rust quand le budget latence fait mal",
        ],
        france: [
          "Ingénieur ESISAR P25 · IRC · SecNumedu",
          "Ouvert à un CDI en France / télétravail UE",
          "Rust et Python · systèmes et détection",
        ],
        australia: [
          "ESISAR P25 · IRC · SecNumedu",
          "Ouvert à l’Australie — Sydney, Melbourne, télétravail",
          "Rust et Python · systèmes et cyber",
        ],
        us: [
          "Citoyen français · Auckland · CTI, éq. master",
          "Ouvert aux équipes US qui portent un visa",
          "Rust et Python · systèmes et cyber",
        ],
        default: [
          "Ingénieur ESISAR P25 · IRC",
          "Ouvert à l’Australie, aux États-Unis et à la France",
          "Rust quand le budget latence fait mal",
          "Des systèmes difficiles à surprendre",
        ],
      },
    };

    const pack = linesByLang[lang] || linesByLang.en;
    const lines = pack[audience] || (isQuietAudience(audience) ? pack.nz : pack.default);

    let cancelled = false;
    stopTyping = () => {
      cancelled = true;
    };

    if (reduce) {
      typed.textContent = lines[0];
      return;
    }

    let line = 0;
    let i = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;
      const full = lines[line];
      typed.textContent = full.slice(0, i);

      if (!deleting && i < full.length) {
        i += 1;
        setTimeout(tick, 38);
        return;
      }

      if (!deleting && i === full.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }

      if (deleting && i > 0) {
        i -= 1;
        setTimeout(tick, 22);
        return;
      }

      deleting = false;
      line = (line + 1) % lines.length;
      setTimeout(tick, 280);
    };

    tick();
  };

  const startBuilder = () => {
    const canvas = document.getElementById("builder-canvas");
    const log = document.getElementById("builder-log");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || 420;
    const cssH = 280;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = cssW;
    const H = cssH;

    // Classic 5×7 caps — must read as FLOLEP (the previous glyph was a cry for help)
    const FONT = {
      F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
      L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
      O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
      E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
      P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    };
    const WORD = "FLOLEP";
    const LETTER_W = 5;
    const LETTER_H = 7;
    const LETTER_GAP = 1;
    const COLS = WORD.length * LETTER_W + (WORD.length - 1) * LETTER_GAP;
    const ROWS = LETTER_H;

    const railY = 16;
    const padX = 16;
    const topY = 34;
    const bottomReserve = 48;
    const gap = Math.max(2, Math.min(3, Math.floor(W / 140)));
    const cell = Math.min(
      (W - padX * 2 - gap * (COLS - 1)) / COLS,
      (H - topY - bottomReserve - gap * (ROWS - 1)) / ROWS
    );
    const gridW = COLS * cell + (COLS - 1) * gap;
    const gridH = ROWS * cell + (ROWS - 1) * gap;
    const originX = (W - gridW) / 2;
    const originY = topY + Math.max(0, (H - topY - bottomReserve - gridH) / 2);

    const letters = WORD.split("").map((ch, li) => {
      const rows = FONT[ch];
      const col0 = li * (LETTER_W + LETTER_GAP);
      const pixels = [];
      for (let r = 0; r < LETTER_H; r++) {
        for (let c = 0; c < LETTER_W; c++) {
          if (rows[r][c] !== "1") continue;
          const gc = col0 + c;
          pixels.push({
            x: originX + gc * (cell + gap),
            y: originY + r * (cell + gap),
          });
        }
      }
      const cx =
        originX +
        col0 * (cell + gap) +
        (LETTER_W * cell + (LETTER_W - 1) * gap) / 2;
      return { ch, cx, pixels };
    });

    const allPixels = letters.flatMap((L) => L.pixels);
    const total = allPixels.length;

    const logs = [
      "> boot construct.exe",
      "> stencil F·L·O·L·E·P",
      "> link rust · python · net",
      "> compile cyber.skills",
      "> hydrate manifoldbt",
      "> seal private vault",
      "> ready",
    ];

    let letterIdx = 0;
    let poured = 0; // pixels placed in current letter
    let settled = []; // {x,y, birth}
    let falling = []; // {x,y, py, birth}
    let phase = "move"; // move → pour → gap → done
    let phaseT = 0;
    let craneX = originX;
    let cableY = railY + 12;
    let logIdx = 0;
    let lastLog = 0;
    let holdUntil = 0;
    let lastNow = performance.now();

    if (reduce) {
      settled = allPixels.map((p) => ({ ...p, birth: 0 }));
      if (log) log.textContent = logs.join("\n");
      phase = "done";
    }

    const easeOut = (x) => 1 - Math.pow(1 - x, 2.6);

    const drawGantry = (hookY) => {
      ctx.strokeStyle = "rgba(232, 255, 249, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX - 10, railY);
      ctx.lineTo(originX + gridW + 10, railY);
      ctx.stroke();

      ctx.strokeStyle = "rgba(232, 255, 249, 0.1)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originX - 8, railY);
      ctx.lineTo(originX - 8, originY + gridH + 6);
      ctx.moveTo(originX + gridW + 8, railY);
      ctx.lineTo(originX + gridW + 8, originY + gridH + 6);
      ctx.stroke();

      ctx.fillStyle = "#1ef2f1";
      ctx.fillRect(craneX - 8, railY - 5, 16, 8);
      ctx.fillStyle = "rgba(11, 18, 13, 0.9)";
      ctx.fillRect(craneX - 3, railY - 2, 6, 3);

      ctx.strokeStyle = "rgba(246, 5, 10, 0.9)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(craneX, railY + 3);
      ctx.lineTo(craneX, hookY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(craneX - 5, hookY);
      ctx.lineTo(craneX + 5, hookY);
      ctx.moveTo(craneX + 5, hookY);
      ctx.quadraticCurveTo(craneX + 5, hookY + 7, craneX, hookY + 7);
      ctx.stroke();
    };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // soft stage wash
      const wash = ctx.createRadialGradient(W * 0.5, H * 0.35, 10, W * 0.5, H * 0.4, W * 0.55);
      wash.addColorStop(0, "rgba(30, 242, 241, 0.05)");
      wash.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, W, H);

      // ghost stencil
      ctx.fillStyle = "rgba(255, 255, 255, 0.045)";
      for (const p of allPixels) ctx.fillRect(p.x, p.y, cell, cell);

      if (!reduce) {
        phaseT += dt;
        const L = letters[Math.min(letterIdx, letters.length - 1)];

        if (phase === "move") {
          const dx = L.cx - craneX;
          craneX += dx * Math.min(1, 8 * dt);
          cableY += (railY + 18 - cableY) * Math.min(1, 10 * dt);
          if (Math.abs(dx) < 1) {
            craneX = L.cx;
            phase = "pour";
            phaseT = 0;
            poured = 0;
          }
        } else if (phase === "pour") {
          cableY = railY + 18 + Math.sin(t * 8) * 2;
          // release next pixel every ~45ms
          while (poured < L.pixels.length && phaseT > poured * 0.045) {
            const p = L.pixels[poured++];
            falling.push({ x: p.x, y: p.y, startY: cableY + 8, birth: now });
          }
          if (poured >= L.pixels.length && falling.length === 0) {
            phase = "gap";
            phaseT = 0;
          }
        } else if (phase === "gap") {
          cableY += (railY + 14 - cableY) * Math.min(1, 8 * dt);
          if (phaseT > 0.22) {
            letterIdx += 1;
            if (letterIdx >= letters.length) {
              phase = "done";
              holdUntil = now + 3000;
            } else {
              phase = "move";
              phaseT = 0;
            }
          }
        } else if (phase === "done") {
          craneX += (originX + gridW / 2 - craneX) * Math.min(1, 3 * dt);
          cableY += (railY + 14 - cableY) * Math.min(1, 5 * dt);
          if (now > holdUntil) {
            letterIdx = 0;
            poured = 0;
            settled = [];
            falling = [];
            phase = "move";
            phaseT = 0;
            holdUntil = 0;
            logIdx = 0;
            lastLog = now;
            if (log) log.textContent = "";
          }
        }

        // advance falling pixels
        const nextFall = [];
        for (const f of falling) {
          const age = (now - f.birth) / 1000;
          const p = easeOut(Math.min(1, age / 0.28));
          f.py = f.startY + (f.y - f.startY) * p;
          if (p >= 1) settled.push({ x: f.x, y: f.y, birth: now });
          else nextFall.push(f);
        }
        falling = nextFall;
      }

      // settled blocks
      for (const p of settled) {
        const age = Math.min(1, (now - p.birth) / 400);
        const pulse = 0.7 + 0.3 * Math.sin(t * 1.5 + p.x * 0.05);
        ctx.fillStyle = `rgba(30, 242, 241, ${0.5 + 0.4 * pulse})`;
        ctx.shadowColor = `rgba(30, 242, 241, ${0.2 + (1 - age) * 0.45})`;
        ctx.shadowBlur = 3 + (1 - age) * 12;
        ctx.fillRect(p.x, p.y, cell, cell);
        ctx.shadowBlur = 0;
      }

      // in-flight pixels
      for (const f of falling) {
        ctx.fillStyle = "rgba(30, 242, 241, 0.95)";
        ctx.fillRect(f.x, f.py, cell, cell);
        ctx.strokeStyle = "rgba(246, 5, 10, 0.4)";
        ctx.strokeRect(f.x + 0.5, f.py + 0.5, cell - 1, cell - 1);
      }

      drawGantry(cableY);

      // baseline
      ctx.strokeStyle = "rgba(30, 242, 241, 0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(originX, originY + gridH + 8);
      ctx.lineTo(originX + gridW, originY + gridH + 8);
      ctx.stroke();

      const done = settled.length;
      const pct = Math.round((done / Math.max(1, total)) * 100);
      const label =
        phase === "done"
          ? "FLOLEP"
          : `FLOLEP`.slice(0, Math.min(WORD.length, letterIdx + (phase === "pour" || phase === "gap" ? 1 : 0)));
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillStyle = "rgba(232, 255, 249, 0.75)";
      ctx.fillText(`${label || "·"}  ${String(pct).padStart(3, "0")}%`, originX, originY + gridH + 26);

      if (log && !reduce && now - lastLog > 620 && logIdx < logs.length) {
        log.textContent = logs.slice(0, ++logIdx).join("\n");
        lastLog = now;
      }

      requestAnimationFrame(draw);
    };

    if (reduce) {
      draw(performance.now());
      return;
    }
    requestAnimationFrame(draw);
  };

  const wireHud = () => {
    const header = document.querySelector(".top");
    const links = [...document.querySelectorAll("nav a[href^='#']")];
    const onScroll = () => {
      if (header) header.classList.toggle("is-stuck", window.scrollY > 12);
      let current = "";
      for (const link of links) {
        if (link.hidden || link.offsetParent === null) continue;
        const id = (link.getAttribute("href") || "").slice(1);
        const el = document.getElementById(id);
        if (!el || el.hidden) continue;
        if (el.getBoundingClientRect().top <= 140) current = id;
      }
      for (const link of links) {
        const on = current && link.getAttribute("href") === `#${current}`;
        link.classList.toggle("is-current", !!on);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  (async () => {
    wireLangSwitch();
    // Lang first (default EN; FR if browser says so / stored / ?lang=)
    applyLang(resolveLang());

    const { audience } = await resolveAudience();
    applyAudience(audience);
    // Re-apply strings that depend on audience visibility after geo settles
    applyLang(currentLang);

    const redirected = await probePrimary(audience);
    if (redirected) return;

    startBuilder();
    wireHud();

    // For the curious: View Source has better jokes. This one is just polite.
    console.info(
      "%cflolep%c  hydrate · don't snort the cola",
      "background:#0b120d;color:#1ef2f1;padding:2px 6px;font-family:monospace",
      "color:#9bb5a8"
    );
  })();
})();
