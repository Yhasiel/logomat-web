const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* Reemplaza únicamente los números cuando tengas los datos oficiales. */
const WHATSAPP_NUMBER = ""; // Ejemplo Perú: 51999999999, sin +, espacios ni guiones.

const toast = $("#toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(window.logomatToast);
  window.logomatToast = setTimeout(() => toast.classList.remove("is-visible"), 3800);
}

function openWhatsApp(message) {
  if (!WHATSAPP_NUMBER) {
    navigator.clipboard?.writeText(message).catch(() => {});
    showToast("La solicitud quedó preparada. Agrega el número oficial en script.js para activar WhatsApp.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

// Navegación entre páginas
const routes = new Set(["inicio", "nosotros", "calidades", "portafolio", "proyectos", "opiniones", "contacto", "cotizador"]);
const routeSections = $$(".route");
const navLinks = $$('[data-nav]');
const mobileMenu = $("#mobileMenu");
const menuButton = $("#menuButton");
function currentRoute() {
  const requested = location.hash.slice(1).split("?")[0];
  return routes.has(requested) ? requested : "inicio";
}
function renderRoute() {
  const route = currentRoute();
  routeSections.forEach(section => section.classList.toggle("is-active", section.dataset.route === route));
  navLinks.forEach(link => link.classList.toggle("is-active", link.dataset.nav === route));
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  window.scrollTo({ top: 0, behavior: "instant" });
  document.title = `${route[0].toUpperCase()}${route.slice(1)} · LOGOMAT`;
  requestAnimationFrame(observeReveals);
}
window.addEventListener("hashchange", renderRoute);
menuButton.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

const header = $("#siteHeader");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("#pageProgress").style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  header.classList.toggle("is-scrolled", scrollY > 12);
}, { passive: true });

function observeReveals() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  }), { threshold: .1 });
  $$(".route.is-active .reveal").forEach(element => observer.observe(element));
}

// Calidades: tres opciones primero, comparación después
const qualityData = {
  medio: { number: "01", title: "Mediano tránsito", copy: "Una solución funcional para accesos con circulación ocasional y uso moderado.", specs: [["Tránsito", "Ocasional"], ["Entorno", "Bajo techo"], ["Ideal para", "Oficinas pequeñas"]] },
  alto: { number: "02", title: "Alto tránsito", copy: "La recomendación más equilibrada para negocios con ingreso frecuente durante el día.", specs: [["Tránsito", "Frecuente"], ["Entorno", "Negocios activos"], ["Ideal para", "Restaurantes y gimnasios"]] },
  premium: { number: "03", title: "Alto tránsito Premium", copy: "Mayor cuerpo y resistencia para entradas de uso intensivo y máxima exigencia.", specs: [["Tránsito", "Intensivo"], ["Entorno", "Alta exigencia"], ["Ideal para", "Grandes comercios"]] }
};
function renderQuality(key = "medio") {
  const quality = qualityData[key];
  $("#qualityFocus").innerHTML = `<div class="focus-number">${quality.number}</div><div class="focus-content"><p class="eyebrow">CALIDAD ${quality.number}</p><h2>${quality.title}</h2><p>${quality.copy}</p><div class="focus-specs">${quality.specs.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}</div><a class="button button-dark" href="#cotizador">Cotizar esta calidad <b>→</b></a></div>`;
}
renderQuality();
$$('[data-quality]').forEach(card => {
  const select = () => {
    $$('[data-quality]').forEach(item => item.classList.remove("is-active"));
    card.classList.add("is-active");
    renderQuality(card.dataset.quality);
    $("#qualityFocus").scrollIntoView({ behavior: "smooth", block: "center" });
  };
  card.addEventListener("click", select);
  card.addEventListener("keydown", event => { if (event.key === "Enter") select(); });
});
$("#compareToggle").addEventListener("click", () => {
  const comparison = $("#comparison");
  const open = comparison.classList.toggle("is-open");
  comparison.setAttribute("aria-hidden", String(!open));
  $("#compareToggle").innerHTML = open ? 'Cerrar comparación <b>↑</b>' : 'Comparar las tres calidades <b>↓</b>';
  if (open) comparison.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Portafolio: visor principal, filtros, flechas, miniaturas y zoom
const portfolio = [
  { name: "Bambú Chifa", category: "Gastronomía", key: "gastronomia", image: "assets/portfolio/bambu.webp" },
  { name: "Barbarroja Terraza", category: "Gastronomía", key: "gastronomia", image: "assets/portfolio/barbarroja.webp" },
  { name: "HI GYM", category: "Deporte y fitness", key: "fitness", image: "assets/portfolio/hi-gym-ambientado.webp" },
  { name: "Sector 7 Training Center", category: "Deporte y fitness", key: "fitness", image: "assets/portfolio/sector-7.webp" },
  { name: "Park Hotel", category: "Hoteles y hospedajes", key: "hoteles", image: "assets/portfolio/park-hotel.webp" },
  { name: "Real Moche Hotel y Casino", category: "Hoteles y hospedajes", key: "hoteles", image: "assets/portfolio/real-moche.webp" },
  { name: "Pakatnamú Casino", category: "Eventos y entretenimiento", key: "eventos", image: "assets/portfolio/pakatnamu.webp" },
  { name: "Agrupación Russkaya", category: "Eventos y entretenimiento", key: "eventos", image: "assets/portfolio/russkaya.webp" },
  { name: "Sonccoyraycu", category: "Eventos y entretenimiento", key: "eventos", image: "assets/portfolio/sonccoyraycu.webp" },
  { name: "Ópticas del Norte", category: "Salud y cuidado personal", key: "salud", image: "assets/portfolio/opticas.webp" },
  { name: "Natuvi", category: "Salud y cuidado personal", key: "salud", image: "assets/portfolio/natuvi.webp" },
  { name: "María de los Ángeles", category: "Salud y cuidado personal", key: "salud", image: "assets/portfolio/maria-angeles.webp" },
  { name: "Castillo Barber Shop", category: "Moda y boutiques", key: "moda", image: "assets/portfolio/castillo.webp" },
  { name: "CREDIAUCA", category: "Empresas e instituciones", key: "empresas", image: "assets/portfolio/crediauca.webp" },
  { name: "Genius", category: "Empresas e instituciones", key: "empresas", image: "assets/portfolio/genius.webp" },
  { name: "Consorcio Cerro Dorado", category: "Empresas e instituciones", key: "empresas", image: "assets/portfolio/cerro-dorado.webp" },
  { name: "Instituto Superior Apurímac", category: "Empresas e instituciones", key: "empresas", image: "assets/portfolio/instituto-apurimac.webp" },
  { name: "Motos Luixo", category: "Comercios y servicios", key: "comercios", image: "assets/portfolio/motos-luixo.webp" },
  { name: "Móvil", category: "Comercios y servicios", key: "comercios", image: "assets/portfolio/movil.webp" }
];
const categoryLabels = { todos: "Todos", gastronomia: "Gastronomía", fitness: "Deporte y fitness", hoteles: "Hoteles", eventos: "Eventos", salud: "Salud", moda: "Moda", empresas: "Empresas", comercios: "Comercios" };
let activeFilter = "todos";
let visiblePortfolio = [...portfolio];
let portfolioIndex = 0;
function renderPortfolioFilters() {
  $("#portfolioFilters").innerHTML = Object.entries(categoryLabels).map(([key, label]) => `<button class="${key === activeFilter ? "is-active" : ""}" data-portfolio-filter="${key}">${label}</button>`).join("");
  $$('[data-portfolio-filter]').forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.portfolioFilter;
    visiblePortfolio = activeFilter === "todos" ? [...portfolio] : portfolio.filter(item => item.key === activeFilter);
    portfolioIndex = 0;
    renderPortfolioFilters();
    renderPortfolio();
  }));
}
function renderPortfolio() {
  const item = visiblePortfolio[portfolioIndex];
  $("#portfolioImage").src = item.image;
  $("#portfolioImage").alt = `Felpudo LOGOMAT de ${item.name}`;
  $("#portfolioName").textContent = item.name;
  $("#portfolioCategory").textContent = item.category;
  $("#portfolioCurrent").textContent = String(portfolioIndex + 1).padStart(2, "0");
  $("#portfolioTotal").textContent = String(visiblePortfolio.length).padStart(2, "0");
  $("#portfolioThumbs").innerHTML = visiblePortfolio.map((project, index) => `<button class="${index === portfolioIndex ? "is-active" : ""}" data-thumb="${index}" aria-label="Ver ${project.name}"><img src="${project.image}" alt=""></button>`).join("");
  $$('[data-thumb]').forEach(button => button.addEventListener("click", () => { portfolioIndex = Number(button.dataset.thumb); renderPortfolio(); }));
}
function changePortfolio(direction) {
  portfolioIndex = (portfolioIndex + direction + visiblePortfolio.length) % visiblePortfolio.length;
  renderPortfolio();
}
$("#portfolioPrev").addEventListener("click", () => changePortfolio(-1));
$("#portfolioNext").addEventListener("click", () => changePortfolio(1));
renderPortfolioFilters();
renderPortfolio();

const imageDialog = $("#imageDialog");
$("#portfolioZoom").addEventListener("click", () => {
  const item = visiblePortfolio[portfolioIndex];
  $("#dialogImage").src = item.image;
  $("#dialogImage").alt = `Proyecto ${item.name} ampliado`;
  $("#dialogTitle").textContent = item.name;
  $("#dialogCategory").textContent = item.category;
  imageDialog.showModal();
});
$("#imageClose").addEventListener("click", () => imageDialog.close());
imageDialog.addEventListener("click", event => { if (event.target === imageDialog) imageDialog.close(); });

// Antes / después
$("#beforeRange").addEventListener("input", event => {
  $("#beforeLayer").style.right = `${100 - event.target.value}%`;
  $("#beforeAfter").style.setProperty("--split", `${event.target.value}%`);
  $("#beforeAfter").style.setProperty("--slider", `${event.target.value}%`);
});

// Opiniones estilo historias
const stories = [portfolio[4], portfolio[2], portfolio[9]];
let storyIndex = 0;
function renderStory() {
  const story = stories[storyIndex];
  $("#storyImage").src = story.image;
  $("#storyImage").alt = `Proyecto LOGOMAT ${story.name}`;
  $("#storyName").textContent = story.name;
  $("#storyCategory").textContent = story.category;
  $("#storyCount").textContent = `${String(storyIndex + 1).padStart(2, "0")} / ${String(stories.length).padStart(2, "0")}`;
}
$("#storyPrev").addEventListener("click", () => { storyIndex = (storyIndex - 1 + stories.length) % stories.length; renderStory(); });
$("#storyNext").addEventListener("click", () => { storyIndex = (storyIndex + 1) % stories.length; renderStory(); });
$("#reviewUpload").addEventListener("change", event => { if (event.target.files[0]) showToast(`Archivo seleccionado: ${event.target.files[0].name}`); });

// Cotizador: portada y cinco pasos
$$('[data-preview-quality]').forEach(button => button.addEventListener("click", () => {
  $$('[data-preview-quality]').forEach(item => item.classList.remove("is-active"));
  button.classList.add("is-active");
  $("#introQuality").textContent = button.dataset.previewQuality;
}));
$("#startQuote").addEventListener("click", () => {
  $("#quoteIntro").style.display = "none";
  $("#quoteBuilder").classList.add("is-active");
  $("#quoteBuilder").setAttribute("aria-hidden", "false");
  $("#quoteBuilder").scrollIntoView({ behavior: "smooth", block: "start" });
});

let quoteStep = 1;
let extraMeasureCount = 0;
const quoteSteps = $$(".quote-step");
const quoteProgress = $$("#quoteProgress span");
const quoteBack = $("#quoteBack");
const quoteNext = $("#quoteNext");
function updateQuoteNavigation() {
  quoteSteps.forEach(step => step.classList.toggle("is-active", Number(step.dataset.step) === quoteStep));
  quoteProgress.forEach((item, index) => item.classList.toggle("is-active", index < quoteStep));
  quoteBack.disabled = quoteStep === 1;
  quoteNext.style.display = quoteStep === 5 ? "none" : "inline-flex";
  quoteNext.innerHTML = quoteStep === 4 ? 'Revisar solicitud <b>→</b>' : 'Continuar <b>→</b>';
}
function allMeasures() {
  const measures = [`${Math.max(1, Number($("#quoteLength").value) || 1)} × ${Math.max(1, Number($("#quoteWidth").value) || 1)} cm`];
  $$(".extra-measure").forEach(row => {
    const inputs = $$('input', row);
    if (inputs[0].value && inputs[1].value) measures.push(`${inputs[0].value} × ${inputs[1].value} cm`);
  });
  return measures;
}
function quoteData() {
  return {
    quality: $('input[name="quoteQuality"]:checked').value,
    measures: allMeasures(),
    color: $('input[name="matColor"]:checked').closest("label").textContent.trim(),
    name: $("#quoteName").value.trim(),
    phone: $("#quotePhone").value.trim(),
    city: $("#quoteCity").value.trim(),
    roof: $("#quoteRoof").value,
    notes: $("#quoteNotes").value.trim() || "Sin indicaciones adicionales"
  };
}
function renderQuoteSummary() {
  const data = quoteData();
  const rows = [["Nombre o empresa", data.name], ["WhatsApp", data.phone], ["Ciudad", data.city], ["Calidad", data.quality], ["Medidas", data.measures.join(" · ")], ["Fondo", data.color], ["Entrada bajo techo", data.roof], ["Indicaciones", data.notes]];
  const summary = $("#quoteSummary");
  summary.innerHTML = "";
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const key = document.createElement("span");
    const content = document.createElement("strong");
    key.textContent = label;
    content.textContent = value;
    row.append(key, content);
    summary.append(row);
  });
}
function validateContactStep() {
  const fields = [$("#quoteName"), $("#quotePhone"), $("#quoteCity")];
  const missing = fields.find(field => !field.value.trim());
  if (missing) {
    missing.focus();
    showToast("Completa nombre, WhatsApp y ciudad para continuar.");
    return false;
  }
  return true;
}
quoteNext.addEventListener("click", () => {
  if (quoteStep === 4 && !validateContactStep()) return;
  if (quoteStep === 4) renderQuoteSummary();
  if (quoteStep < 5) quoteStep += 1;
  updateQuoteNavigation();
  $("#quoteBuilder").scrollIntoView({ behavior: "smooth", block: "start" });
});
quoteBack.addEventListener("click", () => {
  if (quoteStep > 1) quoteStep -= 1;
  updateQuoteNavigation();
  $("#quoteBuilder").scrollIntoView({ behavior: "smooth", block: "start" });
});
$$('input[name="quoteQuality"]').forEach(input => input.addEventListener("change", () => { $("#previewQuality").textContent = input.value; }));
function updatePreviewMeasures() {
  const length = Math.max(1, Number($("#quoteLength").value) || 1);
  const width = Math.max(1, Number($("#quoteWidth").value) || 1);
  const ratio = length / width;
  $("#previewMeasures").textContent = `${length} × ${width} cm`;
  $("#previewRatio").textContent = `${ratio.toFixed(2)} : 1`;
  const visualWidth = Math.min(84, Math.max(48, 46 + ratio * 14));
  $("#previewMat").style.width = `${visualWidth}%`;
  $("#previewMat").style.left = `${(100 - visualWidth) / 2}%`;
  $("#previewMat").style.right = "auto";
}
$("#quoteLength").addEventListener("input", updatePreviewMeasures);
$("#quoteWidth").addEventListener("input", updatePreviewMeasures);
$("#addMeasure").addEventListener("click", () => {
  extraMeasureCount += 1;
  const row = document.createElement("div");
  row.className = "extra-measure";
  row.innerHTML = `<input type="number" min="1" placeholder="Largo cm" aria-label="Largo adicional ${extraMeasureCount}"><input type="number" min="1" placeholder="Ancho cm" aria-label="Ancho adicional ${extraMeasureCount}"><button type="button" aria-label="Quitar medida">×</button>`;
  $("button", row).addEventListener("click", () => row.remove());
  $("#extraMeasures").append(row);
});
$$('input[name="matColor"]').forEach(input => input.addEventListener("change", () => { $("#previewMat").style.background = input.value; }));
$("#logoUpload").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type === "image/svg+xml" || file.type.startsWith("image/")) {
    $("#previewLogo").src = URL.createObjectURL(file);
    $("#previewLogo").style.filter = "none";
    showToast("Logo cargado en la vista previa.");
  }
});
updateQuoteNavigation();
updatePreviewMeasures();

function quoteMessage() {
  const data = quoteData();
  return `Hola, LOGOMAT. Quiero solicitar una cotización.\n\nNombre o empresa: ${data.name}\nWhatsApp: ${data.phone}\nCiudad: ${data.city}\nCalidad: ${data.quality}\nMedidas: ${data.measures.join(" / ")}\nFondo: ${data.color}\nEntrada bajo techo: ${data.roof}\nIndicaciones: ${data.notes}`;
}
$$('.whatsapp-action').forEach(button => button.addEventListener("click", () => {
  const insideQuote = button.closest(".confirmation-step");
  openWhatsApp(insideQuote ? quoteMessage() : "Hola, LOGOMAT. Quiero recibir asesoría para crear un felpudo personalizado para mi negocio.");
}));

$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hola, LOGOMAT. Quiero información.\n\nNombre o empresa: ${data.get("name")}\nWhatsApp: ${data.get("phone")}\nCiudad: ${data.get("city")}\nNecesito: ${data.get("need")}`;
  openWhatsApp(message);
});

// Buscador interno
const searchDialog = $("#searchDialog");
const searchInput = $("#siteSearch");
const searchItems = [
  ["Calidades", "Compara Mediano, Alto y Premium", "calidades"],
  ["Portafolio", "Explora trabajos reales por rubro", "portafolio"],
  ["Cotizador", "Diseña y prepara tu solicitud", "cotizador"],
  ["Proyectos", "Conoce el futuro servicio de mantenimiento", "proyectos"],
  ["Nosotros", "La historia y visión de LOGOMAT", "nosotros"],
  ["Contacto", "Habla con un asesor", "contacto"]
];
function renderSearch(query = "") {
  const normalized = query.trim().toLowerCase();
  const results = normalized ? searchItems.filter(item => item.join(" ").toLowerCase().includes(normalized)) : searchItems;
  $("#searchResults").innerHTML = results.map(item => `<a class="search-result" href="#${item[2]}"><span><strong>${item[0]}</strong><br><small>${item[1]}</small></span><b>→</b></a>`).join("");
  $$(".search-result", $("#searchResults")).forEach(link => link.addEventListener("click", () => searchDialog.close()));
}
$("#searchOpen").addEventListener("click", () => { renderSearch(); searchDialog.showModal(); setTimeout(() => searchInput.focus(), 50); });
$("#searchClose").addEventListener("click", () => searchDialog.close());
searchInput.addEventListener("input", () => renderSearch(searchInput.value));
searchDialog.addEventListener("click", event => { if (event.target === searchDialog) searchDialog.close(); });

$("#year").textContent = new Date().getFullYear();
renderRoute();
