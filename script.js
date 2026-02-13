const products = [
  { id: 1, name: "Air Runner Shoes", category: "shoes", price: 1999, desc: "Comfortable running shoes for daily use." },
  { id: 2, name: "Classic Leather Shoes", category: "shoes", price: 2999, desc: "Formal shoes with premium leather finish." },
  { id: 3, name: "Smart Watch Pro", category: "watches", price: 3499, desc: "Track steps, heart rate, and notifications." },
  { id: 4, name: "Minimal Watch", category: "watches", price: 1499, desc: "Simple design, perfect for everyday style." },
  { id: 5, name: "Phone Max 5G", category: "phones", price: 15999, desc: "Fast performance with 5G support." },
  { id: 6, name: "Phone Lite", category: "phones", price: 9999, desc: "Budget phone with strong battery backup." },
];

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const emptyText = document.getElementById("emptyText");
const countText = document.getElementById("countText");

function render(list){
  grid.innerHTML = "";

  if(list.length === 0){
    emptyText.style.display = "block";
    countText.textContent = "Showing 0 products";
    return;
  }

  emptyText.style.display = "none";
  countText.textContent = `Showing ${list.length} products`;

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${p.category}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row">
        <div class="price">₹${p.price}</div>
        <button class="btn" onclick="alert('Added: ${p.name}')">Add</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function applyFilters(){
  let list = [...products];

  const search = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  // search filter
  if(search){
    list = list.filter(p => p.name.toLowerCase().includes(search));
  }

  // category filter
  if(cat !== "all"){
    list = list.filter(p => p.category === cat);
  }

  // sorting
  if(sort === "low"){
    list.sort((a,b) => a.price - b.price);
  }else if(sort === "high"){
    list.sort((a,b) => b.price - a.price);
  }

  render(list);
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// initial load
render(products);