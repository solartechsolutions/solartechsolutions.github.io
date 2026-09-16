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
