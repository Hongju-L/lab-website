const PAGE_SIZE = 5;
const STRINGS = {
  en: {
    copySuccess: "Copied!",
    copyFail: "Copy failed",
  },
  ko: {
    copySuccess: "복사됨!",
    copyFail: "복사 실패",
  },
};
let visibleCount = PAGE_SIZE;
let publicationList = null;
let showMoreButton = null;
let publicationItems = [];

function initPublications() {
  publicationList = document.getElementById("publication-list");
  showMoreButton = document.getElementById("show-more-pubs");
  if (!publicationList) return;

  publicationItems = Array.from(publicationList.querySelectorAll("li"));
  bindCopyButtons(publicationList);
  applyVisibility();
  initShowMoreButton();
}

function initShowMoreButton() {
  if (!showMoreButton) return;
  if (showMoreButton.dataset.bound === "true") {
    updateShowMoreState();
    return;
  }
  showMoreButton.dataset.bound = "true";
  showMoreButton.addEventListener("click", () => {
    visibleCount = Math.min(visibleCount + PAGE_SIZE, publicationItems.length);
    applyVisibility();
  });
  updateShowMoreState();
}

function applyVisibility() {
  if (!publicationItems.length) {
    updateShowMoreState();
    return;
  }
  publicationItems.forEach((item, index) => {
    item.hidden = index >= visibleCount;
  });
  updateShowMoreState();
}

function updateShowMoreState() {
  if (!showMoreButton) return;
  const shouldHide = visibleCount >= publicationItems.length || !publicationItems.length;
  showMoreButton.hidden = shouldHide;
}

function bindCopyButtons(container) {
  const buttons = container.querySelectorAll(".copy-bibtex");
  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const bibtex = button.dataset.bibtex || "";
      const success = await copyTextToClipboard(bibtex);
      showCopyFeedback(button, success);
    });
  });
}

async function copyTextToClipboard(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.error("Clipboard write failed", error);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (error) {
    console.error("Legacy clipboard copy failed", error);
  } finally {
    document.body.removeChild(textarea);
  }
  return success;
}

function showCopyFeedback(button, success) {
  if (!button) return;
  const originalText = button.textContent;
  const lang = document.documentElement.lang === "ko" ? "ko" : "en";
  const message = success ? STRINGS[lang].copySuccess : STRINGS[lang].copyFail;
  button.textContent = message;
  button.disabled = true;
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1500);
}

function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

onReady(() => {
  initPublications();
});
