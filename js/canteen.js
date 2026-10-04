function renderCanteen() {
  const container = document.getElementById('canteen-menu');
  if (!container) return;

  const groups = ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Specials'];
  const cart = Storage.get(STORAGE_KEYS.cart, []);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const itemGroups = groups.map(category => `
    <section class="menu-group" id="menu-${category.toLowerCase()}">
      <h3>${category}</h3>
      ${campusData.canteen
        .filter(item => item.category === category)
        .map(item => `
          <div class="menu-item">
            <div class="menu-thumb" style="background:${item.image};"></div>
            <div class="item-main">
              <h4>${item.name}</h4>
              <div class="price-row">
                <span>${item.veg ? 'Vegetarian' : 'Non-vegetarian'} · <span class="item-availability ${item.availability === 'Limited' ? 'is-limited' : item.availability === 'Unavailable' ? 'is-unavailable' : ''}">${item.availability}</span></span>
                <span class="price">₹${item.price}</span>
              </div>
            </div>
            <button class="btn btn-secondary add-to-cart" data-id="${item.id}" ${item.availability === 'Unavailable' ? 'disabled' : ''}>Add</button>
          </div>
        `).join('') || '<p>No items available.</p>'}
    </section>
  `).join('');

  const cartItems = cart.length ? cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div class="meta-line"><span>₹${item.price}</span></div>
      </div>
      <div class="qty-controls">
        <button data-action="decrease" data-id="${item.id}">-</button>
        <span>${item.qty}</span>
        <button data-action="increase" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('') : '<p class="muted">Your cart is empty.</p>';

  container.innerHTML = `
    <div class="menu-catalog">
      <nav class="menu-category-nav" aria-label="Menu categories">
        ${groups.map(category => `<a href="#menu-${category.toLowerCase()}">${category}</a>`).join('')}
      </nav>
      <div class="menu-groups">
        ${itemGroups}
      </div>
    </div>
    <aside class="cart-panel">
      <h3>My Cart</h3>
      ${cartItems}
      <div class="subtotal">
        <span>Total</span>
        <span>₹${total}</span>
      </div>
      <button class="btn btn-primary checkout-btn" ${cart.length ? '' : 'disabled'} type="button">Place Order</button>
    </aside>
  `;

  container.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.id));
  });

  container.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => adjustCartQty(button.dataset.id, button.dataset.action));
  });

  container.querySelector('.checkout-btn')?.addEventListener('click', placeOrder);
}

function addToCart(foodId) {
  const cart = Storage.get(STORAGE_KEYS.cart, []);
  const item = campusData.canteen.find(product => product.id === foodId);
  if (!item) return;
  if (item.availability === 'Unavailable') {
    showToast(`${item.name} is currently unavailable.`);
    return;
  }
  const existing = cart.find(product => product.id === foodId);
  const next = existing ? cart.map(product => product.id === foodId ? { ...product, qty: product.qty + 1 } : product) : [...cart, { ...item, qty: 1 }];
  Storage.set(STORAGE_KEYS.cart, next);
  renderCanteen();
  showToast(`${item.name} added to cart.`);
}

function adjustCartQty(foodId, type) {
  const cart = Storage.get(STORAGE_KEYS.cart, []);
  const next = cart
    .map(item => item.id === foodId ? { ...item, qty: type === 'increase' ? item.qty + 1 : item.qty - 1 } : item)
    .filter(item => item.qty > 0);
  Storage.set(STORAGE_KEYS.cart, next);
  renderCanteen();
}

function placeOrder() {
  const cart = Storage.get(STORAGE_KEYS.cart, []);
  if (!cart.length) {
    showToast('Your cart is empty.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    id: `C360-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Preparing',
    total,
    items: cart,
    createdAt: new Date().toISOString().slice(0, 10)
  };
  const orders = Storage.get(STORAGE_KEYS.orders, []);
  Storage.set(STORAGE_KEYS.orders, [order, ...orders]);
  Storage.set(STORAGE_KEYS.cart, []);
  renderCanteen();
  showToast(`Order ${order.id} placed successfully.`);
}
