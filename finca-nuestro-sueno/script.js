const form = document.querySelector("#whatsapp-form");
const galleryPhotos = [...document.querySelectorAll(".gallery-photo")];
const galleryFilters = [...document.querySelectorAll("[data-filter]")];
const photoViewer = document.querySelector("#photo-viewer");
let visiblePhotos = galleryPhotos;
let viewerIndex = 0;
const showPhoto = (index) => {
  viewerIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  const photo = visiblePhotos[viewerIndex].querySelector("img");
  const viewerImage = document.querySelector("#viewer-image");
  viewerImage.src = photo.src;
  viewerImage.alt = photo.alt;
  document.querySelector("#viewer-caption").textContent = photo.alt + " · " + (viewerIndex + 1) + "/" + visiblePhotos.length;
};
galleryFilters.forEach((button) => button.addEventListener("click", () => {
  galleryFilters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
  visiblePhotos = galleryPhotos.filter((photo) => button.dataset.filter === "all" || photo.dataset.category === button.dataset.filter);
  galleryPhotos.forEach((photo) => { photo.hidden = !visiblePhotos.includes(photo); });
}));
galleryPhotos.forEach((photo) => photo.addEventListener("click", () => {
  showPhoto(visiblePhotos.indexOf(photo));
  photoViewer.showModal();
}));
document.querySelector(".viewer-close").addEventListener("click", () => photoViewer.close());
document.querySelector("#viewer-prev").addEventListener("click", () => showPhoto(viewerIndex - 1));
document.querySelector("#viewer-next").addEventListener("click", () => showPhoto(viewerIndex + 1));
photoViewer.addEventListener("click", (event) => { if (event.target === photoViewer) photoViewer.close(); });
photoViewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") { event.preventDefault(); showPhoto(viewerIndex - 1); }
  if (event.key === "ArrowRight") { event.preventDefault(); showPhoto(viewerIndex + 1); }
});
document.querySelectorAll("[data-coffee-view]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".coffee-main-photo").src = "./assets/" + button.dataset.coffeeView + ".webp";
  document.querySelectorAll("[data-coffee-view]").forEach((view) => view.setAttribute("aria-pressed", String(view === button)));
}));
const checkIn = document.querySelector("#check-in");
const checkOut = document.querySelector("#check-out");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const pageSections = [...document.querySelectorAll("[data-page]")];
const tabLinks = [...document.querySelectorAll("[data-tab]")];
const validPages = new Set(["inicio", "finca", "habitaciones", "galeria", "tienda", "transporte", "reservar"]);
const pageTitles = {
  inicio: "Finca Nuestro Sueño | Quimbaya, Quindío",
  finca: "La finca | Nuestro Sueño",
  habitaciones: "Habitaciones | Nuestro Sueño",
  galeria: "Galería | Nuestro Sueño",
  tienda: "Tienda | Nuestro Sueño",
  transporte: "Transporte | Nuestro Sueño",
  reservar: "Reservar | Nuestro Sueño"
};
const pageAliases = { experiencias: "finca", ubicacion: "finca", contacto: "reservar" };

const activatePage = (page, shouldScroll = true) => {
  const resolvedPage = pageAliases[page] || page;
  const selectedPage = validPages.has(resolvedPage) ? resolvedPage : "inicio";

  pageSections.forEach((section) => {
    section.classList.toggle("active-page", section.dataset.page === selectedPage);
  });

  tabLinks.forEach((link) => {
    if (link.closest("nav")) {
      if (link.dataset.tab === selectedPage) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
  });

  document.title = pageTitles[selectedPage];
  siteHeader.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menú");

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
};

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const page = link.dataset.tab;
    if (!validPages.has(page)) return;
    event.preventDefault();
    if (window.location.hash === `#${page}`) activatePage(page);
    else window.location.hash = page;
  });
});

navToggle.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

document.addEventListener("click", (event) => {
  if (!siteHeader.contains(event.target)) {
    siteHeader.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("hashchange", () => activatePage(window.location.hash.slice(1)));
activatePage(window.location.hash.slice(1), false);

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
checkIn.min = localToday;
checkOut.min = localToday;
const transportDate = document.querySelector("#transport-date");
transportDate.min = localToday;

checkIn.addEventListener("change", () => {
  checkOut.min = checkIn.value || localToday;
  if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#guest-name").value.trim();
  const arrival = checkIn.value;
  const departure = checkOut.value;
  const guests = document.querySelector("#guests").value;
  const pets = document.querySelector("#pets").value;
  const note = document.querySelector("#message").value.trim() || "Sin mensaje adicional";

  if (departure <= arrival) {
    checkOut.setCustomValidity("La fecha de salida debe ser posterior a la fecha de entrada.");
    checkOut.reportValidity();
    return;
  }
  checkOut.setCustomValidity("");

  const text = [
    "Hola, quiero consultar la disponibilidad de la Finca Nuestro Sueño.",
    "",
    `Nombre: ${name}`,
    `Entrada: ${arrival}`,
    `Salida: ${departure}`,
    `Huéspedes: ${guests}`,
    `Mascotas: ${pets}`,
    `Mensaje: ${note}`
  ].join("\n");

  window.open(`https://wa.me/573218460307?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

const productCards = [...document.querySelectorAll(".product-card")];
const orderLines = document.querySelector("#order-lines");
const orderTotal = document.querySelector("#order-total");
const sendOrder = document.querySelector("#send-order");
const shopWhatsApp = "573213317339";

const formatCop = (amount) => `$${new Intl.NumberFormat("es-CO").format(amount)} COP`;

const getOrder = () => productCards
  .map((card) => {
    const input = card.querySelector(".quantity-input");
    const quantity = Math.max(0, Math.min(20, Number.parseInt(input.value, 10) || 0));
    input.value = quantity;
    const price = Number(card.dataset.price);
    return {
      label: card.dataset.label,
      quantity,
      price,
      subtotal: quantity * price
    };
  })
  .filter((item) => item.quantity > 0);

const updateOrderSummary = () => {
  const order = getOrder();
  const total = order.reduce((sum, item) => sum + item.subtotal, 0);

  if (order.length === 0) {
    orderLines.innerHTML = '<p class="empty-order">Aún no has agregado productos.</p>';
  } else {
    orderLines.innerHTML = order.map((item) => `
      <div class="order-line">
        <span>${item.quantity} × ${item.label}</span>
        <strong>${formatCop(item.subtotal)}</strong>
      </div>
    `).join("");
  }

  orderTotal.textContent = formatCop(total);
  sendOrder.disabled = order.length === 0;
};

productCards.forEach((card) => {
  const input = card.querySelector(".quantity-input");

  card.querySelectorAll(".quantity-button").forEach((button) => {
    button.addEventListener("click", () => {
      const current = Number.parseInt(input.value, 10) || 0;
      const next = button.dataset.action === "increase" ? current + 1 : current - 1;
      input.value = Math.max(0, Math.min(20, next));
      updateOrderSummary();
    });
  });

  input.addEventListener("input", updateOrderSummary);
  input.addEventListener("blur", updateOrderSummary);
});

sendOrder.addEventListener("click", () => {
  const order = getOrder();
  if (order.length === 0) return;

  const total = order.reduce((sum, item) => sum + item.subtotal, 0);
  const productLines = order.map((item) => `• ${item.quantity} × ${item.label} — ${formatCop(item.subtotal)}`);
  const text = [
    "Hola, quiero solicitar estos productos de Finca Nuestro Sueño:",
    "",
    ...productLines,
    "",
    `Total estimado: ${formatCop(total)}`,
    "",
    "¿Me confirman por favor la existencia y cómo realizar el pago y la entrega?"
  ].join("\n");

  window.open(`https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

updateOrderSummary();

const transportForm = document.querySelector("#transport-form");

transportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#transport-name").value.trim();
  const pickup = document.querySelector("#pickup-place").value.trim();
  const destination = document.querySelector("#transport-destination").value.trim();
  const date = transportDate.value;
  const time = document.querySelector("#transport-time").value;
  const passengers = document.querySelector("#transport-passengers").value;
  const note = document.querySelector("#transport-note").value.trim() || "Sin información adicional";

  const text = [
    "Hola, quiero solicitar un servicio de transporte relacionado con Finca Nuestro Sueño.",
    "",
    `Nombre: ${name}`,
    `Lugar de recogida: ${pickup}`,
    `Destino: ${destination}`,
    `Fecha: ${date}`,
    `Hora deseada: ${time}`,
    `Pasajeros: ${passengers}`,
    `Información adicional: ${note}`,
    "",
    "¿Me confirman por favor la disponibilidad y el valor del servicio?"
  ].join("\n");

  window.open(`https://wa.me/573218460307?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
