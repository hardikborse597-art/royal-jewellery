
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

function saveProducts() {
  localStorage.setItem("jewelleryProducts", JSON.stringify(products));
}

function displayProducts() {
  const list = document.getElementById("productList");

  if (!list) {
    alert("Add an element with id='productList' in admin.html.");
    return;
  }

  list.innerHTML = products.map(product => `
    <div style="border:1px solid #ddd;padding:12px;margin:10px 0;">
      <strong>${product.name}</strong>
      <p>Price: ₹${product.price}</p>
      <p>Category: ${product.category}</p>
      <button onclick="editProduct(${product.id})">Edit</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    </div>
  `).join("");
}

function editProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  const name = prompt("Product name:", product.name);
  if (name === null) return;

  const priceText = prompt("Product price:", product.price);
  if (priceText === null) return;

  const price = Number(priceText);
  if (!name.trim() || !Number.isFinite(price) || price <= 0) {
    alert("Enter a product name and a valid price greater than zero.");
    return;
  }

  const category = prompt("Product category:", product.category);
  if (category === null || !category.trim()) return;

  const image = prompt("Image path:", product.image);
  if (image === null) return;

  const description = prompt("Product description:", product.description || "");
  if (description === null) return;

  Object.assign(product, {
    name: name.trim(),
    price,
    category: category.trim(),
    image: image.trim(),
    description: description.trim()
  });

  saveProducts();
  displayProducts();
  alert("Product updated!");
}

function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  products = products.filter(product => product.id !== id);
  saveProducts();
  displayProducts();
}

displayProducts();

document.getElementById("productForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value.trim();
  const image = document.getElementById("productImage").value.trim();
  const description = document.getElementById("productDescription").value.trim();

  if (!name || !category || !image || !Number.isFinite(price) || price <= 0) {
    alert("Please enter valid product details.");
    return;
  }

  const newProduct = {
    id: Date.now(),
    name: name,
    price: price,
    category: category,
    image: image,
    description: description
  };

  products.push(newProduct);
  saveProducts();
  displayProducts();

  document.getElementById("productForm").reset();
  alert("New product added successfully!");
});
