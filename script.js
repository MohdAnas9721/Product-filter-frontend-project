// fallback data (used if fetch fails)
const fallbackProducts = [
  { id: 1, name: "Air Runner Shoes", category: "shoes", price: 1999, desc: "Comfortable running shoes for daily use.", image: "images/air-runner-shoes.svg", rating: 4.5, stock: 12 },
  { id: 2, name: "Classic Leather Shoes", category: "shoes", price: 2999, desc: "Formal shoes with premium leather finish.", image: "images/classic-leather-shoes.svg", rating: 4.2, stock: 5 },
  { id: 3, name: "Smart Watch Pro", category: "watches", price: 3499, desc: "Track steps, heart rate, and notifications.", image: "images/smart-watch-pro.svg", rating: 4.7, stock: 10 },
  { id: 4, name: "Minimal Watch", category: "watches", price: 1499, desc: "Simple design, perfect for everyday style.", image: "images/minimal-watch.svg", rating: 4.0, stock: 0 },
  { id: 5, name: "Phone Max 5G", category: "phones", price: 15999, desc: "Fast performance with 5G support.", image: "images/phone-max-5g.svg", rating: 4.8, stock: 6 },
  { id: 6, name: "Phone Lite", category: "phones", price: 9999, desc: "Budget phone with strong battery backup.", image: "images/phone-lite.svg", rating: 4.1, stock: 15 }
];

let products = []; // will be populated by fetch or fallback

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const emptyText = document.getElementById("emptyText");
const countText = document.getElementById("countText");

function formatPrice(n){ return `₹${Number(n).toLocaleString()}`; }

function render(list){
  grid.innerHTML = "";

  if(list.length === 0){
    emptyText.style.display = "block";
    emptyText.setAttribute('aria-hidden', 'false');
    countText.textContent = "Showing 0 products";
    return;
  }

  emptyText.style.display = "none";
  emptyText.setAttribute('aria-hidden', 'true');
  countText.textContent = `Showing ${list.length} products`;

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute('data-id', p.id);

    card.innerHTML = `
      ${p.image ? `<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy" />` : ''}
      <span class="badge">${p.category}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="meta">
        <span class="rating">★ ${p.rating ?? '-'} </span>
        <span class="stock ${p.stock && p.stock > 0 ? 'in-stock' : 'out-of-stock'}">${p.stock && p.stock > 0 ? p.stock + ' in stock' : 'Out of stock'}</span>
      </div>
      <div class="row">
        <div class="price">${formatPrice(p.price)}</div>
        <button class="btn" type="button" ${p.stock === 0 ? 'disabled aria-disabled="true"' : ''}>Add</button>
      </div>
    `;

    grid.appendChild(card);

    const btn = card.querySelector('.btn');
    if(btn){
      btn.addEventListener('click', () => {
        alert(`Added: ${p.name}`);
      });
    }
  });
}

function applyFilters(){
  const search = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;
  const sort = sortSelect.value;

  // If static cards exist in DOM, filter & sort DOM nodes directly
  const domCards = Array.from(grid.children).filter(n => n.classList && n.classList.contains('card'));
  if(domCards.length > 0){
    let visible = domCards.filter(card => {
      const name = (card.getAttribute('data-name') || card.querySelector('h3')?.textContent || '').toLowerCase();
      const desc = (card.getAttribute('data-desc') || card.querySelector('p')?.textContent || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      if(search && !(name.includes(search) || desc.includes(search))) return false;
      if(cat !== 'all' && category !== cat) return false;
      return true;
    });

    // sort by price if requested
    if(sort === 'low' || sort === 'high'){
      visible.sort((a,b) => {
        const pa = Number(a.getAttribute('data-price') || a.querySelector('.price')?.textContent.replace(/[^\d]/g,'') || 0);
        const pb = Number(b.getAttribute('data-price') || b.querySelector('.price')?.textContent.replace(/[^\d]/g,'') || 0);
        return sort === 'low' ? pa - pb : pb - pa;
      });
    }

    // hide all, then show & reorder visible
    domCards.forEach(c => c.style.display = 'none');
    visible.forEach(c => {
      c.style.display = '';
      grid.appendChild(c); // move to correct order

      // attach click handler for Add button
      const btn = c.querySelector('.btn');
      const title = c.getAttribute('data-name') || c.querySelector('h3')?.textContent;
      if(btn) btn.onclick = () => alert(`Added: ${title}`);
    });

    const count = visible.length;
    countText.textContent = `Showing ${count} products`;
    if(count === 0){
      emptyText.style.display = 'block';
      emptyText.setAttribute('aria-hidden','false');
    }else{
      emptyText.style.display = 'none';
      emptyText.setAttribute('aria-hidden','true');
    }

    return;
  }

  // Fallback: operate on JS `products` array (original behavior)
  let list = [...products];

  if(search){
    list = list.filter(p => p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search));
  }

  if(cat !== "all"){
    list = list.filter(p => p.category === cat);
  }

  if(sort === "low") list.sort((a,b) => a.price - b.price);
  else if(sort === "high") list.sort((a,b) => b.price - a.price);

  render(list);
}

// small debounce helper for better UX
function debounce(fn, delay = 250){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

searchInput.addEventListener("input", debounce(applyFilters, 250));
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// load products.json (fallback to embedded data)
async function loadProducts(){
  try{
    const res = await fetch('products.json', { cache: 'no-cache' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    products = await res.json();
    console.info('Loaded products.json —', products.length, 'items');
  }catch(err){
    console.warn('Could not load products.json, using fallback data.', err);
    products = fallbackProducts.slice();
  }

  applyFilters();
}

// start
loadProducts();