// API Card
// API Name: iNaturalist
// Base URL: https://api.inaturalist.org/v1
// Endpoint used: taxa?q=apple&per_page=10
// HTTP method: GET
// Status code seen: 200
// Fields used: id, name, preferred_common_name, rank, observations_count, default_photo.square_url

interface TaxonPhoto {
  square_url: string;
}

interface Taxon {
  id: number;
  name: string;
  preferred_common_name?: string;
  rank: string;
  observations_count: number;
  default_photo?: TaxonPhoto | null;
}

interface TaxaResponse {
  total_results: number;
  results: Taxon[];
}

async function getJSON<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json() as T;
  } finally {
    clearTimeout(timer);
  }
}

const statusEl = document.getElementById("status") as HTMLParagraphElement;
const resultsEl = document.getElementById("results") as HTMLDivElement;

function setStatus(text: string): void {
  statusEl.textContent = text;
}

function createCard(item: Taxon): HTMLElement {
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

function render(items: Taxon[]): void {
  resultsEl.innerHTML = "";
  if (items.length === 0) {
    setStatus("No results found.");
    return;
  }
  items.forEach(item => resultsEl.appendChild(createCard(item)));
  setStatus(`Loaded ${items.length} result(s).`);
}

const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const queryInput = document.getElementById("queryInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;

function buildURL(query: string): string {
  const BASE_URL = "https://api.inaturalist.org/v1/taxa";
  return `${BASE_URL}?q=${encodeURIComponent(query)}&per_page=10`;
}

async function search(): Promise<void> {
  const query = queryInput.value.trim();
  if (!query) {
    setStatus("Please enter a search term.");
    return;
  }

  searchBtn.disabled = true;
  setStatus("Loading...");
  resultsEl.innerHTML = "";

  try {
    const data = await getJSON<TaxaResponse>(buildURL(query));
    const items: Taxon[] = data.results;
    render(items);
    localStorage.setItem("lastQuery", query);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    setStatus(`Load failed: ${msg}`);
  } finally {
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