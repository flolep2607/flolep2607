<!--
  Profile README — https://github.com/flolep2607
  Palette from https://flolep.fr — ink #0b120d · cyan #1ef2f1 · red #f6050a
  Positioning: ESISAR P25 engineer · Xtracta (hired) · systems + cyber
-->

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3600&pause=1000&color=1EF2F1&center=true&vCenter=true&width=820&height=60&lines=Florian+Leprat+%E2%80%94+ESISAR+P25;Engineer+at+Xtracta+%C2%B7+Auckland;Cyber+%C2%B7+networks+%C2%B7+AI+%C2%B7+Rust" alt="Florian Leprat — ESISAR P25 engineer" />

### Ingénieur ESISAR P25 · IRC (cyber, réseaux, IA)

Engineer at **[Xtracta](https://xtracta.com)** (Auckland) since **September 2025**.
I build systems that have to be fast, observable and hard to surprise —
mostly in **Rust** and **Python**. IRC-trained; shipping in production.

**Grenoble INP · ESISAR**, promo **P25**, filière **Informatique, Réseaux et Cybersécurité (IRC)** — **ANSSI SecNumedu** · graduated **August 2025**

<a href="https://flolep.fr"><img src="https://img.shields.io/badge/flolep.fr-0b120d?style=for-the-badge&logo=googlechrome&logoColor=1ef2f1&labelColor=0b120d" alt="Website" /></a>
<a href="https://me.flolep.fr"><img src="https://img.shields.io/badge/me.flolep.fr-0b120d?style=for-the-badge&logo=readme&logoColor=1ef2f1&labelColor=0b120d" alt="me.flolep.fr" /></a>
<a href="https://www.linkedin.com/in/florian-leprat"><img src="https://img.shields.io/badge/LinkedIn-0b120d?style=for-the-badge&logo=linkedin&logoColor=1ef2f1&labelColor=0b120d" alt="LinkedIn" /></a>
<a href="https://www.manifoldbt.com"><img src="https://img.shields.io/badge/manifoldbt.com-0b120d?style=for-the-badge&logo=rust&logoColor=1ef2f1&labelColor=0b120d" alt="ManifoldBT" /></a>

**Auckland** · French citizen · TOEIC **925**

</div>

<br />

# 🪪 &nbsp;Now

<div align="center">

**Engineer — [Xtracta](https://xtracta.com)**, Auckland · since **September 2025**

</div>

---

# 🧭 &nbsp;ManifoldBT

<div align="center">

**Backtesting engine for quantitative research** · Python DSL, Rust execution core

<a href="https://www.manifoldbt.com"><img src="https://img.shields.io/badge/website-0b120d?style=flat-square&logo=googlechrome&logoColor=1ef2f1&labelColor=0b120d" alt="site" /></a>
<a href="https://pypi.org/project/manifoldbt/"><img src="https://img.shields.io/pypi/v/manifoldbt?style=flat-square&color=1ef2f1&labelColor=0b120d&label=pypi" alt="pypi" /></a>
<a href="https://github.com/manifoldbt/manifoldbt"><img src="https://img.shields.io/github/stars/manifoldbt/manifoldbt?style=flat-square&color=1ef2f1&labelColor=0b120d" alt="stars" /></a>
<img src="https://img.shields.io/badge/500K%20bars%20in%20~26ms-0b120d?style=flat-square&color=f6050a&labelColor=0b120d" alt="benchmark" />
<img src="https://img.shields.io/badge/161×%20faster%20than%20vectorbt-0b120d?style=flat-square&color=f6050a&labelColor=0b120d" alt="vs vectorbt" />

</div>

Strategies are written in a fluent Python DSL, compiled into an optimised Rust expression
graph, and executed vectorised. Monte Carlo, walk-forward validation, parameter sweeps,
lookahead detection and exposure diagnostics ship as standard — a fast backtest that
quietly cheats is worse than a slow one. Connectors for Binance, Bybit, Hyperliquid, dYdX,
Bitstamp and Databento. `pip install manifoldbt` needs no Rust toolchain.

```python
fast, slow = ema(close, 12), ema(close, 26)

strategy = (
    mbt.Strategy.create("ema_crossover")
      .signal("signal", mbt.when(fast > slow, mbt.lit(1.0), mbt.lit(-1.0)))
      .size(mbt.col("signal") * mbt.lit(0.25))
)

result = mbt.run(strategy, config, store)
```

> **My role:** core contributor. I wrote effectively all of the next version — engine,
> DSL surface and validation tooling — currently unreleased.
>
> Why it belongs here: large Rust codebases, adversarial edge-cases, reproducible
> pipelines and performance under constraints are the same muscles cybersecurity work uses.

<div align="center">

[Website](https://www.manifoldbt.com) &nbsp;·&nbsp; [Documentation](https://www.manifoldbt.com/docs/documentation.html) &nbsp;·&nbsp; [Repository](https://github.com/manifoldbt/manifoldbt)

</div>

---

# 📦 &nbsp;Public work

<table>
<tr>
<td width="50%" valign="top">

### 📟 [cctop](https://github.com/flolep2607/cctop)

<a href="https://github.com/flolep2607/cctop/releases"><img src="https://img.shields.io/github/v/release/flolep2607/cctop?style=flat-square&color=1ef2f1&labelColor=0b120d" alt="release" /></a>
<img src="https://img.shields.io/badge/Rust-0b120d?style=flat-square&logo=rust&logoColor=1ef2f1" alt="Rust" />
<img src="https://img.shields.io/badge/cargo%20install-0b120d?style=flat-square&color=1ef2f1&labelColor=0b120d" alt="cargo install" />

**htop for AI coding agents.** One TUI for every Claude Code, Codex, Cursor, Gemini CLI session on the machine — cost, context window, who’s waiting on you.

Reads what the agents leave on disk. Musl static builds, `cctop doctor`, live hooks. A real product, not a wrapper around an API.

</td>
<td width="50%" valign="top">

### 🔥 [thermalbloater](https://github.com/flolep2607/thermalbloater)

<a href="https://github.com/flolep2607/thermalbloater/releases"><img src="https://img.shields.io/github/v/release/flolep2607/thermalbloater?style=flat-square&color=1ef2f1&labelColor=0b120d" alt="release" /></a>
<img src="https://img.shields.io/badge/Rust-0b120d?style=flat-square&logo=rust&logoColor=1ef2f1" alt="Rust" />
<img src="https://img.shields.io/badge/CUDA%2011·12·13-0b120d?style=flat-square&logo=nvidia&logoColor=1ef2f1" alt="CUDA" />

I don’t have a heater. So I wrote one: max out every NVIDIA GPU’s watt draw until the room warms up, then hold each card just under a temperature cap.

It autotunes at startup — sweeping `f32`/`f16`/`bf16` and matrix sizes while measuring real watts — and runs an independent duty cycle per device. One binary, CUDA resolved at runtime, prebuilt for Linux and Windows.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📈 [tvdata](https://github.com/flolep2607/tvdata)

<a href="https://pypi.org/project/tvdata/"><img src="https://img.shields.io/pypi/v/tvdata?style=flat-square&color=1ef2f1&labelColor=0b120d&label=pypi" alt="pypi" /></a>
<img src="https://img.shields.io/badge/Python-0b120d?style=flat-square&logo=python&logoColor=1ef2f1" alt="Python" />
<img src="https://img.shields.io/badge/typed-mypy-0b120d?style=flat-square&logoColor=1ef2f1" alt="typed" />

**`pip install TvData`** — library and CLI for pulling candle data in bulk, chunked straight into Pandas without tripping request limits.

Type-hinted throughout, tested, pre-commit hooked, released through CI. The unglamorous layer under most of my research, done properly once so I never think about it again.

</td>
<td width="50%" valign="top">

### 🧪 Also in the open

- [**hexapod**](https://github.com/flolep2607/hexapod) — Rust / WASM gait lab: physics sim, ARS trainer, hardware sizer
- [**git_commit**](https://github.com/Floteur/git_commit) — AI commit agent since **Dec 2022**, before the category existed
- [**neat_trading_rs**](https://github.com/flolep2607/neat_trading_rs) — NEAT neuroevolution in Rust
- [**soko**](https://github.com/flolep2607/soko) — Sokoban in C / SDL, pathfinding, Doxygen'd
- [**AdventOfCode**](https://github.com/flolep2607/AdventOfCode) — December habit since 2015
- Upstream: [newspaper4k](https://github.com/AndyTheFactory/newspaper4k/pull/594) (merged) · [TradingView-API](https://github.com/Mathieu2301/TradingView-API/pull/289)

</td>
</tr>
</table>

<p align="center">
  <a href="https://github.com/flolep2607/cctop"><img src="https://github-readme-stats.anuraghazra1.vercel.app/api/pin/?username=flolep2607&repo=cctop&theme=transparent&bg_color=0b120d&title_color=1ef2f1&text_color=e8fff9&icon_color=1ef2f1&border_color=1a2a22" alt="cctop" /></a>
  <a href="https://github.com/flolep2607/thermalbloater"><img src="https://github-readme-stats.anuraghazra1.vercel.app/api/pin/?username=flolep2607&repo=thermalbloater&theme=transparent&bg_color=0b120d&title_color=1ef2f1&text_color=e8fff9&icon_color=1ef2f1&border_color=1a2a22" alt="thermalbloater" /></a>
</p>

---

# 🎯 &nbsp;IRC · systems

What the public work actually exercises:

| Muscle | Where it shows up |
| :--- | :--- |
| **Systems & low-level** | Rust engines, C projects, CUDA binaries, musl static builds |
| **Networks & infra** | Cloudflare Workers/tunnels, WireGuard-backed stacks, proxy-aware collectors |
| **Collection & analysis** | OSINT pipelines on FastAPI, scheduled collectors, Prometheus/Grafana |
| **Adversarial thinking** | Latency races, lookahead detection, edge-case hunting — same habit as threat modelling |
| **Education** | Grenoble INP · ESISAR **P25** — **IRC** (SecNumedu), graduated August 2025 |

---

# 🔒 &nbsp;Behind the private wall

<div align="center">
<sub>~75 private repositories · no links</sub><br />
<sub>The catalogue that doesn't belong on a public page — some of it boring infrastructure,<br />
some of it the kind of curiosity that stays private on purpose.</sub>
</div>

<br />

<table>
<tr>
<td width="50%" valign="top">

**📡 &nbsp;Collection & analysis**

- OSINT service — FastAPI, pluggable scheduled collectors, multiple open sources
- Macro / market data platforms with auth, rate limits and monitoring
- Vehicle market scraper — Postgres history, Prometheus and Grafana
- Pipelines that turn noisy feeds into something a human can act on

</td>
<td width="50%" valign="top">

**⚙️ &nbsp;Systems & trading infrastructure**

- Rust listing detector — millisecond budget, static musl builds
- On-chain arbitrage on HyperEVM — Rust + Solidity
- Cross-venue detection (prediction markets), dividend research, RL experiments
- Self-play poker agent in PyTorch

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🧱 &nbsp;Infrastructure**

- Filesystem backed by Discord — JS first, rewritten in Rust
- LLM proxy on Cloudflare Workers
- Self-hosted media stack behind WireGuard + Cloudflare tunnel
- Homelab habits: containers, tunnels, least-surprise networking

</td>
<td width="50%" valign="top">

**🚀 &nbsp;Products**

- AI trip planner for Japan — Vue 3 · Fastify · Gemini · Capacitor
- Recipe manager · Flutter radar-alert app
- Godot game-jam entry with its own camera plugin
- CS:GO trade-up EV calculators in Rust/WASM (`Print 💸`)

</td>
</tr>
</table>

<div align="center"><sub>Happy to walk through the polite half in a conversation. The rest stays in the vault.</sub></div>

---

# 🌐 &nbsp;Live on flolep.fr

<div align="center">

| Tool | | |
| :--- | :--- | :--- |
| [**radar**](https://radar.flolep.fr) | Radar map | Every French speed camera, mapped |
| [**anime**](https://anime.flolep.fr) | Anime search | One query across ~50 VOSTFR/VF sources |
| [**vignette**](https://vignette.flolep.fr) | Vignette de CT | Lost your inspection sticker? Reprint it |
| [**0x40**](https://music.weeb.flolep.fr) | Hues player | Installable PWA, sound and strobe |
| [**osu**](https://osu.weeb.flolep.fr) | osu! on web | Click circles, no install |
| [**flolep.fr**](https://flolep.fr) | HQ | Pixel-art homepage with a CRT toggle |

</div>

---

# 🛠️ &nbsp;Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=rust,python,c,cpp,linux,bash,docker,cloudflare,postgres,ts,vue,nodejs,java,git&perline=14" alt="Rust Python C C++ Linux Bash Docker Cloudflare Postgres TypeScript Vue Node Java Git" />

**Daily** — Rust · Python · Linux  
**Networks & infra** — Docker · Cloudflare Workers / tunnels · WireGuard · Postgres · Prometheus / Grafana  
**Also** — TypeScript · Vue · C / C++ · Java · FastAPI

</div>

---

# 📊 &nbsp;By the numbers

<p align="center">
  <img height="165" src="https://github-readme-stats.anuraghazra1.vercel.app/api?username=flolep2607&show_icons=true&include_all_commits=true&count_private=true&theme=transparent&bg_color=0b120d&title_color=1ef2f1&text_color=e8fff9&icon_color=1ef2f1&ring_color=f6050a&border_color=1a2a22" alt="GitHub stats" />
  <img height="165" src="https://github-readme-stats.anuraghazra1.vercel.app/api/top-langs/?username=flolep2607&layout=compact&langs_count=6&hide=html,css,php,makefile&theme=transparent&bg_color=0b120d&title_color=1ef2f1&text_color=e8fff9&border_color=1a2a22" alt="Top languages" />
</p>

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=flolep2607&bg_color=0b120d&color=1ef2f1&line=1ef2f1&point=f6050a&area=true&area_color=1ef2f1&hide_border=true&custom_title=Commits%20over%20the%20last%20year" alt="Contribution activity graph" />
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/flolep2607/flolep2607/output/snake.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/flolep2607/flolep2607/output/snake-light.svg" />
  <img alt="A snake eating my contribution graph" src="https://raw.githubusercontent.com/flolep2607/flolep2607/output/snake.svg" />
</picture>

<div align="center"><sub>The language chart counts public lines only — most of the Rust lives behind the wall. The snake counts nothing at all.</sub></div>

---

<div align="center">

[flolep.fr](https://flolep.fr) &nbsp;·&nbsp; [me.flolep.fr](https://me.flolep.fr) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/florian-leprat) &nbsp;·&nbsp; [manifoldbt.com](https://www.manifoldbt.com)

</div>
