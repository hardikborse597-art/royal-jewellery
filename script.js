


const defaultProducts = [
  { id: 1, name: "Gold Ring", price: 999, image: "images/ring.jpg", category: "Rings", description: "Elegant gold ring." },
  { id: 2, name: "Gold Necklace", price: 2499, image: "images/necklace.jpg", category: "Necklaces", description: "Beautiful necklace." },
  { id: 3, name: "Mangalsutra", price: 1499, image: "images/mangalsutra.jpg", category: "Mangalsutras", description: "Traditional mangalsutra." },
  { id: 4, name: "Gold Pendant", price: 799, image: "images/pendant.jpg", category: "Pendants", description: "Stylish gold pendant." },
  { id: 5, name: "Gold Bracelet", price: 1299, image: "images/bracelet.jpg", category: "Bracelets", description: "Classic gold bracelet." },
  { id: 6, name: "Gold Bangles", price: 1999, image: "images/bangles.jpg", category: "Bangles", description: "Beautiful gold bangles." }
];

let products = JSON.parse(
  localStorage.getItem("jewelleryProducts") ||
  JSON.stringify(defaultProducts)
);



let cart = JSON.parse(
  localStorage.getItem("jewelleryCart") || "[]"
);

function saveCart() {
  localStorage.setItem("jewelleryCart", JSON.stringify(cart));
}

function displayProducts() {
  document.getElementById("product-list").innerHTML =
    products.map(p => `
      <div class="product">
        <img src="${p.image}" alt="${p.name}"
          onerror="this.onerror=null;this.src='https://placehold.co/300x220/f5ead5/6b4b18?text=Jewellery';">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
        
        <button onclick="showDetails(${p.id})">View Details</button>
        <button onclick="addToCart(${p.id})">Add to Cart</button>

      </div>
    `).join("");
}

let selectedCategory = "All";

function displayProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  const search = document.getElementById("search-box");
  const query = search ? search.value.trim().toLowerCase() : "";

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = "<p>No jewellery found.</p>";
    return;
  }

  list.innerHTML = filtered.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}"
        onerror="this.onerror=null;this.src='https://placehold.co/300x220/f5ead5/6b4b18?text=Jewellery';">
      <h3>${p.name}</h3>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

function filterCategory(category) {
  selectedCategory = category;
  displayProducts();
}

document.getElementById("search-box").addEventListener(
  "input",
  displayProducts
);


function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  saveCart();
  displayCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
  displayCart();
}

function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}

function displayCart() {
  const container = document.getElementById("cart-items");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    container.innerHTML = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      if (!p) return "";

      const subtotal = p.price * item.quantity;
      total += subtotal;

      return `
        <div class="cart-item">
          <span>${p.name}<br>₹${p.price.toLocaleString("en-IN")}</span>
          <span>
            <button onclick="changeQuantity(${p.id}, -1)">−</button>
            ${item.quantity}
            <button onclick="changeQuantity(${p.id}, 1)">+</button>
            <br>Subtotal: ₹${subtotal.toLocaleString("en-IN")}
          </span>
        </div>
      `;
    }).join("");
  }

  document.getElementById("cart-total").textContent =
    "Total: ₹" + total.toLocaleString("en-IN");

  saveCart();
}


function checkout() {
  if (cart.length === 0) {
    document.getElementById("message").textContent =
      "Please add a product before checkout.";
    return;
  }

  localStorage.setItem(
    "jewelleryCart",
    JSON.stringify(cart)
  );

  window.location.href = "checkout.html";
}


  alert("Your cart is ready. We will build checkout next.");

displayProducts();
displayCart();

function showDetails(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("details-image").src = product.image;
  document.getElementById("details-name").textContent = product.name;
  document.getElementById("details-description").textContent =
    product.description || "Beautiful jewellery for your collection.";
  document.getElementById("details-price").textContent =
    "₹" + product.price.toLocaleString("en-IN");

  document.getElementById("details-add").onclick = function() {
    addToCart(product.id);
  };

  document.getElementById("product-details").hidden = false;
  document.getElementById("product-details").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function closeDetails() {
  document.getElementById("product-details").hidden = true;
}

function getCartItems() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCartItems(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQuantity(productId, change) {
  const cart = getCartItems();

  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.quantity = Number(item.quantity || 1) + change;

  if (item.quantity <= 0) {
    const updatedCart = cart.filter(product => product.id !== productId);
    saveCartItems(updatedCart);
  } else {
    saveCartItems(cart);
  }

  if (typeof displayCart === "function") {
    displayCart();
  } else {
    location.reload();
  }
}
