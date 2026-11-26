"use strict";
// API Card
// API Name: iNaturalist
// Base URL: https://api.inaturalist.org/v1
// Endpoint used: taxa?q=apple&per_page=10
// HTTP method: GET
// Status code seen: 200
// Fields used: id, name, preferred_common_name, rank, observations_count, default_photo.square_url
async function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }
    finally {
        clearTimeout(timer);
    }
}
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
function setStatus(text) {
    statusEl.textContent = text;
}
function createCard(item) {
    const card = document.createElement("div");
    card.className = "card";
    if (item.default_photo) {
        const img = document.createElement("img");
        img.src = item.default_photo.square_url;
        img.alt = item.preferred_common_name ?? item.name;
        card.appendChild(img);
    }
    const title = document.createElement("h3");
    title.textContent = item.preferred_common_name ?? item.name;
    const sci = document.createElement("p");
    sci.textContent = `${item.name} (${item.rank})`;
    const count = document.createElement("p");
    count.textContent = `Observations: ${item.observations_count}`;
    card.appendChild(title);
    card.appendChild(sci);
    card.appendChild(count);
    return card;
}
function render(items) {
    resultsEl.innerHTML = "";
    if (items.length === 0) {
        setStatus("No results found.");
        return;
    }
    items.forEach(item => resultsEl.appendChild(createCard(item)));
    setStatus(`Loaded ${items.length} result(s).`);
}
const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
function buildURL(query) {
    const BASE_URL = "https://api.inaturalist.org/v1/taxa";
    return `${BASE_URL}?q=${encodeURIComponent(query)}&per_page=10`;
}
async function search() {
    const query = queryInput.value.trim();
    if (!query) {
        setStatus("Please enter a search term.");
        return;
    }
    searchBtn.disabled = true;
    setStatus("Loading...");
    resultsEl.innerHTML = "";
    try {
        const data = await getJSON(buildURL(query));
        const items = data.results;
        render(items);
        localStorage.setItem("lastQuery", query);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setStatus(`Load failed: ${msg}`);
    }
    finally {
        searchBtn.disabled = false;
    }
}
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search();
});
window.addEventListener("DOMContentLoaded", () => {
    const lastQuery = localStorage.getItem("lastQuery");
    if (lastQuery) {
        queryInput.value = lastQuery;
    }
});
