const REPOSITORY = "willfromlondon/garden";
const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`;
const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;

function detectPlatform() {
  const source = `${navigator.userAgent || ""} ${navigator.platform || ""}`.toLowerCase();
  if (source.includes("win")) return "windows";
  if (source.includes("mac")) return "macos";
  if (source.includes("linux") || source.includes("x11")) return "linux";
  return "unknown";
}

function detectArchitecture() {
  const source = `${navigator.userAgent || ""} ${navigator.platform || ""}`.toLowerCase();
  return /arm64|aarch64/.test(source) ? "arm64" : "x64";
}

function platformName(platform) {
  return { windows: "Windows", macos: "macOS", linux: "Linux" }[platform] || "your computer";
}

function selectReleaseAsset(assets, platform, architecture) {
  const candidates = assets.map((asset) => ({ ...asset, lower: asset.name.toLowerCase() }));
  const find = (...tests) => candidates.find((asset) => tests.every((test) => test(asset.lower)));
  const excludes = (name) => !name.endsWith(".sig") && !name.endsWith(".sha256") && !name.endsWith(".json");

  if (platform === "windows") {
    return find((name) => name.endsWith(".msi"), excludes)
      || find((name) => name.endsWith(".exe") && /setup|installer/.test(name), excludes);
  }
  if (platform === "macos") {
    if (architecture === "arm64") {
      return find((name) => name.endsWith(".dmg") && /aarch64|arm64/.test(name), excludes)
        || find((name) => name.endsWith(".dmg") && /universal/.test(name), excludes)
        || find((name) => name.endsWith(".dmg"), excludes);
    }
    return find((name) => name.endsWith(".dmg") && /x64|x86_64/.test(name), excludes)
      || find((name) => name.endsWith(".dmg") && /universal/.test(name), excludes)
      || find((name) => name.endsWith(".dmg"), excludes);
  }
  if (platform === "linux") {
    return find((name) => name.endsWith(".appimage"), excludes)
      || find((name) => name.endsWith(".deb"), excludes)
      || find((name) => name.endsWith(".rpm"), excludes);
  }
  return null;
}

async function configureDownloads() {
  const links = [...document.querySelectorAll("[data-download-link]")];
  const labels = [...document.querySelectorAll("[data-download-label]")];
  const statuses = [...document.querySelectorAll("[data-release-status]")];
  if (!links.length) return;

  const platform = detectPlatform();
  const readablePlatform = platformName(platform);
  labels.forEach((label) => { label.textContent = platform === "unknown" ? "Download garden" : `Download for ${readablePlatform}`; });

  try {
    const response = await fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } });
    if (response.status === 404) {
      links.forEach((link) => { link.href = RELEASES_URL; });
      statuses.forEach((status) => {
        status.textContent = "No public release is available yet. Build from source on GitHub.";
        status.classList.add("is-warning");
      });
      return;
    }
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const release = await response.json();
    const asset = selectReleaseAsset(release.assets || [], platform, detectArchitecture());
    if (asset) {
      links.forEach((link) => { link.href = asset.browser_download_url; });
      statuses.forEach((status) => {
        status.textContent = `${release.name || release.tag_name} · ${asset.name}`;
        status.classList.remove("is-warning");
      });
      return;
    }
    links.forEach((link) => { link.href = release.html_url || RELEASES_URL; });
    statuses.forEach((status) => {
      status.textContent = platform === "unknown"
        ? "Choose an installer on the GitHub Releases page."
        : `The latest release does not include a ${readablePlatform} installer yet.`;
      status.classList.add("is-warning");
    });
  } catch (error) {
    links.forEach((link) => { link.href = RELEASES_URL; });
    statuses.forEach((status) => {
      status.textContent = "Could not check the latest release. View releases on GitHub.";
      status.classList.add("is-warning");
    });
  }
}

function configureMenu() {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (!button || !nav) return;
  const close = () => {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

const nodeDetails = {
  start: ["Start", "Start", "Receives the approved task plan and begins the Arch."],
  primary: ["Agent", "Primary Agent", "Implements the task against a staged candidate using the selected model."],
  reviewer: ["Agent", "Reviewer", "Checks the implementation, findings and evidence independently."],
  changes: ["Gate", "Changes needed?", "Routes supported work forward and sends material issues to repair."],
  repair: ["Agent", "Repair", "Addresses the reviewer’s findings, then returns the candidate for another check."],
  user: ["User Gate", "Your judgement", "Pauses the Arch when the agents still disagree and asks you to choose."],
  finish: ["Finish", "Finish", "Completes the run and presents the evidence and staged changes for your decision."]
};

function configureArchInspector() {
  const nodes = [...document.querySelectorAll("[data-node]")];
  const kind = document.querySelector("[data-inspector-kind]");
  const title = document.querySelector("[data-inspector-title]");
  const copy = document.querySelector("[data-inspector-copy]");
  if (!nodes.length || !kind || !title || !copy) return;
  nodes.forEach((node) => {
    node.addEventListener("click", () => {
      nodes.forEach((item) => {
        item.classList.toggle("is-selected", item === node);
        item.setAttribute("aria-pressed", String(item === node));
      });
      const details = nodeDetails[node.dataset.node];
      [kind.textContent, title.textContent, copy.textContent] = details;
    });
  });
}

function configureArchRoutes() {
  const workspace = document.querySelector(".arch-workspace");
  const svg = workspace?.querySelector(".arch-routes");
  const routes = svg ? [...svg.querySelectorAll("[data-route-from]")] : [];
  if (!workspace || !svg || !routes.length) return;

  const pointFor = (node, side, bounds) => {
    const rect = node.getBoundingClientRect();
    if (side === "out") {
      const port = node.querySelector(".port-out")?.getBoundingClientRect();
      if (port) return { x: port.left + port.width / 2 - bounds.left, y: port.top + port.height / 2 - bounds.top };
      return { x: rect.right - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
    }
    if (side === "bottom") return { x: rect.left + rect.width / 2 - bounds.left, y: rect.bottom - bounds.top };
    return { x: rect.left - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
  };

  const update = () => {
    if (getComputedStyle(svg).display === "none") return;
    const bounds = workspace.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);

    routes.forEach((route) => {
      const from = workspace.querySelector(`[data-node="${route.dataset.routeFrom}"]`);
      const to = workspace.querySelector(`[data-node="${route.dataset.routeTo}"]`);
      if (!from || !to) return;
      const shape = route.dataset.routeShape || "forward";
      const start = pointFor(from, "out", bounds);
      const end = pointFor(to, shape === "return" ? "bottom" : "in", bounds);
      const distance = Math.max(36, Math.abs(end.x - start.x));
      let path;

      if (shape === "return") {
        path = `M${start.x} ${start.y} C${start.x + 46} ${start.y + 72}, ${end.x + 116} ${end.y + 84}, ${end.x} ${end.y}`;
      } else {
        const pull = Math.min(86, Math.max(30, distance * 0.42));
        path = `M${start.x} ${start.y} C${start.x + pull} ${start.y}, ${end.x - pull} ${end.y}, ${end.x} ${end.y}`;
      }
      route.setAttribute("d", path);
    });
  };

  window.requestAnimationFrame(update);
  document.fonts?.ready.then(update);
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(workspace);
  else window.addEventListener("resize", update, { passive: true });
}

const archPresets = {
  "closed-loop": {
    nodes: [
      ["start", "start", "Start", "start", 2, 39, "Receives the approved task plan and begins the Arch."],
      ["maker", "agent", "Primary Agent", "Codex", 18.5, 34, "Builds the first staged candidate."],
      ["reviewer", "agent", "Reviewer", "Claude", 37.5, 34, "Reviews the work and records evidence."],
      ["review-gate", "gate", "Changes needed?", "2 routes", 56.3, 34, "Sends accepted work forward or routes findings to repair."],
      ["repair", "agent", "Repair", "Codex", 75.3, 15, "Repairs the issues found by the reviewer."],
      ["human-gate", "human", "Your judgement", "Waiting for input", 75.3, 61, "Lets you direct the work when the agents still disagree."],
      ["finish", "finish", "Finish", "finish", 89, 39, "Presents the evidence and staged changes for your decision."]
    ],
    edges: [["start", "maker"], ["maker", "reviewer"], ["reviewer", "review-gate"], ["review-gate", "repair"], ["review-gate", "human-gate"], ["repair", "finish"], ["human-gate", "finish"], ["human-gate", "review-gate", "return"]]
  },
  "quick-pass": {
    nodes: [["start", "start", "Start", "start", 3, 48, "Receives the approved task plan and begins the Arch."], ["maker", "agent", "Maker", "Codex", 29, 48, "Builds a focused staged candidate."], ["second-pass", "agent", "Second Pass", "Claude", 55, 48, "Reviews and corrects the candidate once."], ["finish", "finish", "Finish", "finish", 84, 48, "Presents the completed candidate and evidence."]],
    edges: [["start", "maker"], ["maker", "second-pass"], ["second-pass", "finish"]]
  },
  "deep-cycle": {
    nodes: [["start", "start", "Start", "start", 2, 28, "Receives the approved task plan and begins the Arch."], ["cycle", "loop", "Cycle", "Bounded loop", 17, 28, "Repeats the builder and critic until they agree or the loop ends."], ["maker", "agent", "Maker", "Codex", 32, 28, "Builds or revises the staged candidate."], ["critic", "agent", "Critic", "Claude", 47, 28, "Looks for material problems in the candidate."], ["review-gate", "gate", "Changes needed?", "2 routes", 62, 28, "Loops material findings back or completes accepted work."], ["human-gate", "human", "Your judgement", "Waiting for input", 49, 74, "Asks you to direct the work if the bounded loop cannot resolve it."], ["directed-repair", "agent", "Directed Repair", "Codex", 68, 74, "Applies your direction to the candidate."], ["finish", "finish", "Finish", "finish", 86, 28, "Presents the completed candidate and evidence."]],
    edges: [["start", "cycle"], ["cycle", "maker"], ["maker", "critic"], ["critic", "review-gate"], ["review-gate", "maker", "return"], ["review-gate", "finish"], ["cycle", "human-gate"], ["human-gate", "finish"], ["human-gate", "directed-repair"], ["directed-repair", "finish"]]
  },
  "independent-synthesis": {
    nodes: [["start", "start", "Start", "start", 2, 48, "Starts two independent proposals from the same task plan."], ["proposal-a", "agent", "Proposal A", "Codex", 13, 26, "Builds one independent approach."], ["proposal-b", "agent", "Proposal B", "Claude", 13, 72, "Builds a second independent approach."], ["join", "join", "Join", "2 inputs", 27, 48, "Waits for both proposals."], ["reconcile", "agent", "Reconcile", "Codex", 39, 48, "Combines the strongest parts into one candidate."], ["review", "agent", "Review", "Claude", 51, 48, "Reviews the reconciled candidate."], ["review-gate", "gate", "Changes needed?", "2 routes", 63, 48, "Finishes accepted work or routes findings to repair."], ["repair", "agent", "Repair", "Codex", 76, 79, "Repairs the review findings."], ["finish", "finish", "Finish", "finish", 89, 48, "Presents the completed candidate and evidence."]],
    edges: [["start", "proposal-a"], ["start", "proposal-b"], ["proposal-a", "join"], ["proposal-b", "join"], ["join", "reconcile"], ["reconcile", "review"], ["review", "review-gate"], ["review-gate", "finish"], ["review-gate", "repair"], ["repair", "finish"]]
  }
};

function configureArchDemo() {
  const select = document.querySelector("[data-arch-select]");
  const label = document.querySelector("[data-arch-label]");
  const workspace = document.querySelector("[data-arch-workspace]");
  const layer = workspace?.querySelector(".arch-node-layer");
  const svg = workspace?.querySelector(".arch-routes");
  const inspector = [document.querySelector("[data-inspector-kind]"), document.querySelector("[data-inspector-title]"), document.querySelector("[data-inspector-copy]")];
  if (!select || !workspace || !layer || !svg || inspector.some((item) => !item)) return;

  let routes = [];
  const pointFor = (node, side, bounds) => {
    const port = node.querySelector(`.port-${side}`)?.getBoundingClientRect();
    if (port) return { x: port.left + port.width / 2 - bounds.left, y: port.top + port.height / 2 - bounds.top };
    const rect = node.getBoundingClientRect();
    if (side === "bottom") return { x: rect.left + rect.width / 2 - bounds.left, y: rect.bottom - bounds.top };
    return { x: side === "out" ? rect.right - bounds.left : rect.left - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
  };
  const updateRoutes = () => {
    if (getComputedStyle(svg).display === "none") return;
    const bounds = workspace.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    routes.forEach((route) => {
      const from = workspace.querySelector(`[data-node="${route.dataset.routeFrom}"]`);
      const to = workspace.querySelector(`[data-node="${route.dataset.routeTo}"]`);
      if (!from || !to) return;
      const shape = route.dataset.routeShape || "forward";
      const start = pointFor(from, "out", bounds);
      const end = pointFor(to, shape === "return" ? "bottom" : "in", bounds);
      const distance = Math.max(36, Math.abs(end.x - start.x));
      if (shape === "return") route.setAttribute("d", `M${start.x} ${start.y} C${start.x + 30} ${start.y + 100}, ${end.x + 80} ${end.y + 110}, ${end.x} ${end.y}`);
      else {
        const pull = Math.min(86, Math.max(30, distance * 0.42));
        route.setAttribute("d", `M${start.x} ${start.y} C${start.x + pull} ${start.y}, ${end.x - pull} ${end.y}, ${end.x} ${end.y}`);
      }
    });
  };
  const inspect = (node, details) => {
    layer.querySelectorAll("[data-node]").forEach((item) => {
      item.classList.toggle("is-selected", item === node);
      item.setAttribute("aria-pressed", String(item === node));
    });
    inspector[0].textContent = details[1] === "human" ? "User Gate" : details[1].replace(/^./, (letter) => letter.toUpperCase());
    inspector[1].textContent = details[2];
    inspector[2].textContent = details[6];
  };
  const render = () => {
    const preset = archPresets[select.value];
    workspace.className = `arch-workspace preset-${select.value}`;
    label.textContent = select.value === "closed-loop" ? "Default Arch" : "Included Arch";
    svg.replaceChildren(...preset.edges.map(([from, to, shape]) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.dataset.routeFrom = from;
      path.dataset.routeTo = to;
      if (shape) {
        path.dataset.routeShape = shape;
        path.classList.add("return-route");
      }
      return path;
    }));
    layer.replaceChildren(...preset.nodes.map((details, index) => {
      const [id, type, name, meta, x, y] = details;
      const node = document.createElement("button");
      node.className = `arch-node node-${type}${index === 0 ? " is-selected" : ""}`;
      node.type = "button";
      node.dataset.node = id;
      node.style.cssText = `--x:${x}%;--y:${y}%`;
      node.setAttribute("aria-pressed", String(index === 0));
      node.innerHTML = `<span class="port port-in" aria-hidden="true"></span><small>${type === "human" ? "User Gate" : type}</small><strong>${name}</strong><span>${meta}</span><span class="port port-out" aria-hidden="true"></span>`;
      node.addEventListener("click", () => inspect(node, details));
      return node;
    }));
    routes = [...svg.querySelectorAll("[data-route-from]")];
    inspect(layer.firstElementChild, preset.nodes[0]);
    window.requestAnimationFrame(updateRoutes);
  };
  select.addEventListener("change", render);
  render();
  document.fonts?.ready.then(updateRoutes);
  if ("ResizeObserver" in window) new ResizeObserver(updateRoutes).observe(workspace);
  else window.addEventListener("resize", updateRoutes, { passive: true });
}

function configureCommandTabs() {
  const tabs = [...document.querySelectorAll("[data-command-tab]")];
  const panels = [...document.querySelectorAll("[data-command-panel]")];
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selected = tab.dataset.commandTab;
      tabs.forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      panels.forEach((panel) => { panel.hidden = panel.dataset.commandPanel !== selected; });
    });
  });

  document.querySelectorAll("[data-copy-command]").forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.previousElementSibling?.textContent || "";
      try {
        await navigator.clipboard.writeText(command);
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1600);
      } catch {
        button.textContent = "Select text";
      }
    });
  });
}

function configureRunAnimation() {
  const stage = document.querySelector("[data-run-stage]");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stage.classList.add("can-animate");
  const steps = [...stage.querySelectorAll("[data-run-step]")];
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    steps.forEach((step, index) => {
      window.setTimeout(() => step.classList.add("is-active"), 170 * index);
    });
    observer.disconnect();
  }, { threshold: 0.35 });
  observer.observe(stage);
}

function configureHeroGrowth() {
  const word = document.querySelector("[data-growing-word]");
  if (!word || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const drawDuration = 4200;
  const stemDelays = [...word.querySelectorAll(".growth-stem")].map((stem, index) => {
    const delay = Math.round(index * 70 + Math.random() * 90);
    stem.style.setProperty("--stem-delay", `${delay}ms`);
    return delay;
  });
  word.querySelectorAll(".growth-branch").forEach((branch) => {
    const stemIndex = Number.parseInt(branch.dataset.growthStem, 10);
    const progress = Number.parseFloat(branch.dataset.growthAt);
    const branchDelay = Math.round((stemDelays[stemIndex] ?? 0) + progress * drawDuration - 120 + Math.random() * 80);
    branch.style.setProperty("--branch-delay", `${branchDelay}ms`);
  });
  word.querySelectorAll(".growth-leaf").forEach((leaf) => {
    const stemIndex = Number.parseInt(leaf.dataset.growthStem, 10);
    const progress = Number.parseFloat(leaf.dataset.growthAt);
    const bloomDelay = Math.round((stemDelays[stemIndex] ?? 0) + progress * drawDuration + 520 + Math.random() * 120);
    leaf.style.setProperty("--bloom-delay", `${bloomDelay}ms`);
    leaf.style.setProperty("--vein-delay", `${bloomDelay + 130}ms`);
  });
  word.querySelectorAll("[data-growth-optional]").forEach((leaf) => {
    leaf.classList.toggle("is-dormant", Math.random() < 0.28);
  });
  word.querySelectorAll(".growth-flower").forEach((flower) => {
    const stemIndex = Number.parseInt(flower.dataset.growthStem, 10);
    const bloomDelay = Math.round((stemDelays[stemIndex] ?? 0) + drawDuration - 100 + Math.random() * 180);
    flower.style.setProperty("--bloom-delay", `${bloomDelay}ms`);
  });

  word.classList.add("can-grow");
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => word.classList.add("is-growing"));
  });
}

function configureStickyHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const update = () => header.classList.toggle("is-stuck", window.scrollY > 140);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function configureGroveAnimation() {
  const grove = document.querySelector("[data-grove-animation]");
  const panel = grove?.closest(".project-panel");
  if (!grove || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let visible = false;
  const update = () => panel.classList.toggle("is-running", visible && !document.hidden);
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    update();
  }, { rootMargin: "120px 0px", threshold: 0.2 });

  panel.classList.add("can-animate");
  observer.observe(panel);
  document.addEventListener("visibilitychange", update);
}

function configureArchMarquee() {
  const marquee = document.querySelector("[data-arch-marquee]");
  const toggle = document.querySelector("[data-arch-marquee-toggle]");
  if (!marquee || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rows = [...marquee.querySelectorAll("[data-arch-marquee-row]")];
  rows.forEach((row) => {
    const group = row.querySelector(".arch-marquee-group");
    if (!group) return;
    const duplicate = group.cloneNode(true);
    duplicate.setAttribute("aria-hidden", "true");
    duplicate.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", "-1"));
    row.append(duplicate);
  });

  let visible = false;
  let paused = false;
  const update = () => marquee.classList.toggle("is-running", visible && !paused && !document.hidden);
  const observer = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    update();
  }, { rootMargin: "160px 0px" });

  marquee.classList.add("is-ready");
  observer.observe(marquee);
  document.addEventListener("visibilitychange", update);
  toggle?.addEventListener("click", () => {
    paused = !paused;
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.textContent = paused ? "Resume movement" : "Pause movement";
    update();
  });
}

configureMenu();
configureArchDemo();
configureCommandTabs();
configureHeroGrowth();
configureRunAnimation();
configureGroveAnimation();
configureStickyHeader();
configureArchMarquee();
configureDownloads();
