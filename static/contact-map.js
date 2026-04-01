function onReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initContactMap() {
  const container = document.getElementById("contact-map");
  if (!container) return;
  if (typeof L === "undefined") {
    console.warn("Leaflet is not available, skipping contact map.");
    return;
  }

  const lat = parseFloat(container.dataset.lat) || 0;
  const lng = parseFloat(container.dataset.lng) || 0;
  const zoom = parseInt(container.dataset.zoom, 10) || 13;
  const label = (container.dataset.label || "Location").trim();

  const map = L.map(container, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  }).setView([lat, lng], zoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker([lat, lng]).addTo(map);
  const safeLabel = escapeHtml(label);
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
  const googleLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lat},${lng}`
  )}`;
  const naverPlace = (container.dataset.naverPlace || "").trim();
  const naverLink = naverPlace
    ? `https://map.naver.com/p/entry/place/${encodeURIComponent(naverPlace)}`
    : `https://map.naver.com/v5/search/${encodeURIComponent(
        label || `${lat}, ${lng}`
      )}/?c=${lng},${lat},${zoom},0,0,0,0`;
  const kakaoLabel = (label.split(",")[0] || "Location").trim();
  const kakaoLink = `https://map.kakao.com/link/map/${encodeURIComponent(
    kakaoLabel || "Location"
  )},${lat},${lng}`;
  const linksHtml = [
    { href: osmLink, label: "OpenStreetMap" },
    { href: googleLink, label: "Google Maps" },
    { href: naverLink, label: "Naver Maps" },
    { href: kakaoLink, label: "Kakao Maps" },
  ]
    .map(
      (link) =>
        `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
    )
    .join("");
  marker.bindPopup(
    `<div class="map-popup-title">${safeLabel}</div><div class="map-links">${linksHtml}</div>`
  );
  const addressTrigger = document.querySelector(".contact-address-trigger");
  if (addressTrigger) {
    addressTrigger.addEventListener("click", (event) => {
      event.preventDefault();
      map.setView([lat, lng], zoom, { animate: true });
      marker.openPopup();
    });
  }

  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    map.dragging.disable();
    map.tap?.disable();
  }
}

onReady(initContactMap);
