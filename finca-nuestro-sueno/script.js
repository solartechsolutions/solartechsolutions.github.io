const form = document.querySelector("#whatsapp-form");
const checkIn = document.querySelector("#check-in");
const checkOut = document.querySelector("#check-out");

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
checkIn.min = localToday;
checkOut.min = localToday;

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
