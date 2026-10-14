
const WHATSAPP_NUMBER = "919484486546";

// Keep product prices consistent with script.js
const products = [
  { id: 1, name: "Gold Ring", price: 999 },
  { id: 2, name: "Gold Necklace", price: 2499 },
  { id: 3, name: "Mangalsutra", price: 1499 },
  { id: 4, name: "Gold Pendant", price: 799 },
  { id: 5, name: "Gold Bracelet", price: 1299 },
  { id: 6, name: "Gold Bangles", price: 1999 }
];

const cart = JSON.parse(
  localStorage.getItem("jewelleryCart") || "[]"
);

const validItems = cart.filter(item =>
  products.some(p => p.id === item.id) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0
);

const total = validItems.reduce((sum, item) => {
  const product = products.find(p => p.id === item.id);
  return sum + product.price * item.quantity;
}, 0);

document.getElementById("checkout-total").textContent =
  "Order Total: ₹" + total.toLocaleString("en-IN");

document.getElementById("checkout-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const message = document.getElementById("checkout-message");

    if (!validItems.length) {
      message.textContent = "Your cart is empty. Please shop first.";
      return;
    }

    if (!/^91[6-9][0-9]{9}$/.test(WHATSAPP_NUMBER)) {
      message.textContent =
        "Please replace YOURNUMBER in checkout.js with your WhatsApp number.";
      return;
    }

    const payment = document.querySelector(
      'input[name="payment"]:checked'
    );

    if (!payment) return;

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    const lines = validItems.map(item => {
      const product = products.find(p => p.id === item.id);
      return `${product.name} x ${item.quantity} = ₹${
        (product.price * item.quantity).toLocaleString("en-IN")
      }`;
    });

    const order = [
      "NEW ORDER - ROYAL JEWELLERY",
      "",
      ...lines,
      "",
      `Total: ₹${total.toLocaleString("en-IN")}`,
      "",
      `Customer: ${name}`,
      `Customer Mobile: ${phone}`,
      `Address: ${address}`,
      `City: ${city}`,
      `PIN Code: ${pincode}`,
      `Payment Preference: ${payment.value}`,
      "",
      "Please confirm availability and final order details."
    ].join("\n");

    const url =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(order);

    window.open(url, "_blank");
  }
);
