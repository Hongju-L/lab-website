(() => {
  const widgetMarkup = `
    <div id="font-switcher" class="font-switcher" role="dialog" aria-label="Font tester">
      <div class="font-switcher__title">Font tester</div>
      <div class="font-switcher__row">
        <label class="font-switcher__label" for="font-switcher-heading">Header font</label>
        <select id="font-switcher-heading"></select>
        <input
          id="font-switcher-heading-custom"
          type="text"
          placeholder="Custom name (overrides list)"
        />
      </div>
      <div class="font-switcher__row">
        <label class="font-switcher__label" for="font-switcher-body">Body font</label>
        <select id="font-switcher-body"></select>
        <input
          id="font-switcher-body-custom"
          type="text"
          placeholder="Custom name (overrides list)"
        />
      </div>
      <div class="font-switcher__history" aria-label="Font history">
        <div class="font-switcher__history-title">History</div>
        <div class="font-switcher__history-group">
          <span class="font-switcher__history-label">Header</span>
          <div id="font-switcher-heading-history" class="font-switcher__history-list"></div>
        </div>
        <div class="font-switcher__history-group">
          <span class="font-switcher__history-label">Body</span>
          <div id="font-switcher-body-history" class="font-switcher__history-list"></div>
        </div>
      </div>
      <button type="button" id="font-switcher-reset">Reset to default</button>
    </div>
  `;

  const widgetStyles = `
    .font-switcher {
      position: fixed;
      right: 1.25rem;
      bottom: 1.25rem;
      z-index: 30;
      display: grid;
      gap: 0.6rem;
      width: min(260px, 92vw);
      padding: 0.85rem;
      border-radius: 0.9rem;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(2, 6, 23, 0.92);
      box-shadow: 0 18px 40px rgba(2, 6, 23, 0.55);
      font-family: var(--body-font);
      color: #e2e8f0;
      font-size: 0.85rem;
    }

    .font-switcher__title {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .font-switcher__row {
      display: grid;
      gap: 0.35rem;
      font-weight: 500;
    }

    .font-switcher__label {
      font-weight: 600;
    }

    .font-switcher select {
      width: 100%;
      padding: 0.35rem 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(148, 163, 184, 0.45);
      background: rgba(15, 23, 42, 0.85);
      color: #e2e8f0;
      font-family: inherit;
    }

    .font-switcher input {
      width: 100%;
      padding: 0.35rem 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(148, 163, 184, 0.45);
      background: rgba(15, 23, 42, 0.85);
      color: #e2e8f0;
      font-family: inherit;
    }

    .font-switcher__history {
      display: grid;
      gap: 0.45rem;
    }

    .font-switcher__history-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.75;
    }

    .font-switcher__history-group {
      display: grid;
      gap: 0.35rem;
    }

    .font-switcher__history-label {
      font-size: 0.8rem;
      font-weight: 600;
      opacity: 0.85;
    }

    .font-switcher__history-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .font-switcher__history-chip {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.45);
      background: rgba(15, 23, 42, 0.85);
      color: inherit;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.55rem;
      cursor: pointer;
    }

    .font-switcher__history-chip:hover {
      background: rgba(56, 189, 248, 0.2);
    }

    .font-switcher button {
      padding: 0.4rem 0.6rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(148, 163, 184, 0.5);
      background: rgba(56, 189, 248, 0.15);
      color: #e2e8f0;
      font-weight: 600;
      cursor: pointer;
    }

    .font-switcher button:hover {
      background: rgba(56, 189, 248, 0.3);
    }

    body {
      font-family: var(--body-font);
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .lab-name,
    .pi-name,
    .team-name {
      font-family: var(--heading-font);
    }

    @media (max-width: 720px) {
      .font-switcher {
        right: 1rem;
        left: 1rem;
        width: auto;
      }
    }
  `;

  const init = () => {
    if (!document.head || !document.body) return;
    if (document.getElementById("font-switcher")) return;

    const template = document.createElement("template");
    template.innerHTML = widgetMarkup.trim();
    const widget = template.content.firstElementChild;
    if (!widget) return;
    document.body.appendChild(widget);

    if (!document.querySelector('style[data-font-switcher="true"]')) {
      const style = document.createElement("style");
      style.setAttribute("data-font-switcher", "true");
      style.textContent = widgetStyles.trim();
      document.head.appendChild(style);
    }

    const headingSelect = document.getElementById("font-switcher-heading");
    const headingInput = document.getElementById("font-switcher-heading-custom");
    const bodySelect = document.getElementById("font-switcher-body");
    const bodyInput = document.getElementById("font-switcher-body-custom");
    const headingHistoryList = document.getElementById("font-switcher-heading-history");
    const bodyHistoryList = document.getElementById("font-switcher-body-history");
    const resetButton = document.getElementById("font-switcher-reset");
    if (
      !headingSelect ||
      !headingInput ||
      !bodySelect ||
      !bodyInput ||
      !headingHistoryList ||
      !bodyHistoryList ||
      !resetButton
    ) {
      widget.remove();
      return;
    }

    let linkEl = document.getElementById("font-switcher-google");
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.id = "font-switcher-google";
      document.head.appendChild(linkEl);
    }

    const fontOptions = [
      { label: "Diphylleia", family: "Diphylleia", category: "serif" },
      { label: "Gothic A1", family: "Gothic A1", category: "sans" },
      { label: "Inter", family: "Inter", category: "sans" },
      { label: "Manrope", family: "Manrope", category: "sans" },
      { label: "Space Grotesk", family: "Space Grotesk", category: "sans" },
      { label: "IBM Plex Sans", family: "IBM Plex Sans", category: "sans" },
      { label: "Sora", family: "Sora", category: "sans" },
      { label: "Work Sans", family: "Work Sans", category: "sans" },
      { label: "Source Serif 4", family: "Source Serif 4", category: "serif" },
      { label: "Merriweather", family: "Merriweather", category: "serif" },
      { label: "Spectral", family: "Spectral", category: "serif" },
      { label: "Fraunces", family: "Fraunces", category: "serif" },
      { label: "Playfair Display", family: "Playfair Display", category: "serif" },
      { label: "IBM Plex Serif", family: "IBM Plex Serif", category: "serif" },
      { label: "Bebas Neue", family: "Bebas Neue", category: "display" }
    ];

    const fontMap = new Map(fontOptions.map((font) => [font.family, font]));
    const fallbackMap = {
      sans: '"Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      display: '"Helvetica Neue", Arial, sans-serif'
    };

    const HISTORY_LIMIT = 8;
    const INPUT_DEBOUNCE_MS = 350;
    let inputDebounceTimer = null;
    let historyRequestId = 0;
    let currentHref = "";

    const historyState = {
      heading: {
        items: [],
        set: new Set(),
        list: headingHistoryList,
        input: headingInput
      },
      body: {
        items: [],
        set: new Set(),
        list: bodyHistoryList,
        input: bodyInput
      }
    };

    function buildOption(font) {
      const option = document.createElement("option");
      option.value = font.family;
      option.textContent = font.label;
      return option;
    }

    function populateSelect(selectEl) {
      fontOptions.forEach((font) => selectEl.appendChild(buildOption(font)));
    }

    function resolveFamily(customValue, fallbackValue) {
      const trimmed = customValue.trim();
      return trimmed ? trimmed : fallbackValue;
    }

    function renderHistory(state) {
      state.list.innerHTML = "";
      state.items.forEach((family) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "font-switcher__history-chip";
        button.textContent = family;
        button.addEventListener("click", () => {
          state.input.value = family;
          applyCurrentSelection();
        });
        state.list.appendChild(button);
      });
      if (!state.items.length) {
        const empty = document.createElement("span");
        empty.textContent = "None yet";
        empty.style.opacity = "0.6";
        empty.style.fontSize = "0.75rem";
        state.list.appendChild(empty);
      }
    }

    function addHistoryEntry(state, family) {
      if (!family || state.set.has(family)) return;
      state.items.unshift(family);
      state.set.add(family);
      if (state.items.length > HISTORY_LIMIT) {
        const removed = state.items.pop();
        if (removed) {
          state.set.delete(removed);
        }
      }
      renderHistory(state);
    }

    async function recordHistoryIfLoaded(state, family) {
      if (!family || state.set.has(family)) return;
      if (document.fonts?.load) {
        await document.fonts.load(`400 1em "${family}"`);
      }
      if (document.fonts?.check && !document.fonts.check(`400 1em "${family}"`)) {
        return;
      }
      addHistoryEntry(state, family);
    }

    function waitForStylesheetLoad(requestId, hrefChanged) {
      if (!hrefChanged || !currentHref) return Promise.resolve(false);
      return new Promise((resolve) => {
        const onDone = () => {
          if (requestId !== historyRequestId) return;
          cleanup();
          resolve(true);
        };
        const cleanup = () => {
          linkEl.removeEventListener("load", onDone);
          linkEl.removeEventListener("error", onDone);
        };
        linkEl.addEventListener("load", onDone);
        linkEl.addEventListener("error", onDone);
      });
    }

    function applyFontSelection(headingFamily, bodyFamily) {
      const selectedFamilies = [headingFamily, bodyFamily].filter(Boolean);
      const uniqueFamilies = Array.from(new Set(selectedFamilies));
      const nextHref = uniqueFamilies.length
        ? `https://fonts.googleapis.com/css2?${uniqueFamilies
            .map((family) => {
              const encoded = encodeURIComponent(family).replace(/%20/g, "+");
              return `family=${encoded}:wght@300;400;500;600;700`;
            })
            .join("&")}&display=swap`
        : "";
      const hrefChanged = nextHref !== currentHref;
      currentHref = nextHref;
      if (uniqueFamilies.length) {
        if (hrefChanged) {
          linkEl.href = nextHref;
        }
      } else {
        linkEl.removeAttribute("href");
      }

      const headingMeta = fontMap.get(headingFamily);
      const bodyMeta = fontMap.get(bodyFamily);
      const headingFallback = fallbackMap[headingMeta?.category || "sans"];
      const bodyFallback = fallbackMap[bodyMeta?.category || "sans"];

      document.documentElement.style.setProperty(
        "--heading-font",
        `"${headingFamily}", ${headingFallback}`
      );
      document.documentElement.style.setProperty(
        "--body-font",
        `"${bodyFamily}", ${bodyFallback}`
      );

      const requestId = ++historyRequestId;
      void (async () => {
        await waitForStylesheetLoad(requestId, hrefChanged);
        if (requestId !== historyRequestId) return;
        await recordHistoryIfLoaded(historyState.heading, headingFamily);
        await recordHistoryIfLoaded(historyState.body, bodyFamily);
      })();
    }

    populateSelect(headingSelect);
    populateSelect(bodySelect);

    const defaults = {
      heading: "Diphylleia",
      body: "Gothic A1"
    };

    function syncDefaults() {
      headingSelect.value = defaults.heading;
      headingInput.value = "";
      bodySelect.value = defaults.body;
      bodyInput.value = "";
      applyFontSelection(defaults.heading, defaults.body);
    }

    function applyCurrentSelection() {
      const headingFamily = resolveFamily(headingInput.value, headingSelect.value);
      const bodyFamily = resolveFamily(bodyInput.value, bodySelect.value);
      applyFontSelection(headingFamily, bodyFamily);
    }

    headingSelect.addEventListener("change", () => {
      applyCurrentSelection();
    });

    bodySelect.addEventListener("change", () => {
      applyCurrentSelection();
    });

    function debounceApplyCurrentSelection() {
      if (inputDebounceTimer) {
        window.clearTimeout(inputDebounceTimer);
      }
      inputDebounceTimer = window.setTimeout(() => {
        inputDebounceTimer = null;
        applyCurrentSelection();
      }, INPUT_DEBOUNCE_MS);
    }

    headingInput.addEventListener("input", debounceApplyCurrentSelection);
    bodyInput.addEventListener("input", debounceApplyCurrentSelection);

    resetButton.addEventListener("click", syncDefaults);

    renderHistory(historyState.heading);
    renderHistory(historyState.body);
    syncDefaults();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
