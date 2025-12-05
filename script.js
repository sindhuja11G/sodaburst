// Product Database
const products = [
    // Classic Sodas
    { id: 1, name: 'Cola Blast 500ml', price: 40, category: 'Classic Sodas', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop' },
    { id: 2, name: 'Orange Sparkle 500ml', price: 35, category: 'Classic Sodas', image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=400&h=400&fit=crop' },
    { id: 3, name: 'Lemon Lime Fizz 750ml', price: 45, category: 'Classic Sodas', image: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=400&fit=crop' },
    
    // Fruit Juices
    { id: 4, name: 'Mango Splash 1L', price: 90, category: 'Fruit Juices', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop' },
    { id: 5, name: 'Mixed Fruit Delight 1L', price: 95, category: 'Fruit Juices', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=400&fit=crop' },
    { id: 6, name: 'Fresh Orange Juice 500ml', price: 60, category: 'Fruit Juices', image: 'https://images.unsplash.com/photo-1600217365413-223c65301371?w=400&h=400&fit=crop' },
    
    // Energy Drinks
    { id: 7, name: 'PowerBoost 250ml', price: 80, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=400&fit=crop' },
    { id: 8, name: 'IsoHydrate Lemon 500ml', price: 70, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1624552398324-5c0cc5d90ade?w=400&h=400&fit=crop' },
    { id: 9, name: 'RedRush 250ml', price: 85, category: 'Energy Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    
    // Diet Drinks
    { id: 10, name: 'Zero Sugar Cola', price: 45, category: 'Diet Drinks', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=400&fit=crop' },
    { id: 11, name: 'Diet Lemon Soda', price: 40, category: 'Diet Drinks', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop' },
    { id: 12, name: 'Stevia Orange Drink', price: 50, category: 'Diet Drinks', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop' }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const page = window.location.pathname.split('/').pop();
    
    if (page === 'products.html' || page === '') {
        loadProducts();
        setupFilters();
        setupSearch();
    } else if (page === 'cart.html') {
        loadCart();
    } else if (page === 'payment.html') {
        loadCheckout();
        setupPaymentForm();
    } else if (page === 'thankyou.html') {
        clearCart();
    }
});

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Load products on products page
function loadProducts(filter = 'all', searchTerm = '') {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (!grid) return;
    
    let filteredProducts = products;
    
    // Apply category filter
    if (filter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Display products or no results message
    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        grid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">₹${product.price}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Setup category filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const searchTerm = document.getElementById('search-input')?.value || '';
            loadProducts(category, searchTerm);
        });
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const activeFilter = document.querySelector('.filter-btn.active');
            const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
            loadProducts(category, this.value);
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show feedback
    alert(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    loadCart();
}

// Clear entire cart
function clearCart() {
    if (window.location.pathname.includes('cart.html')) {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCart();
            updateCartCount();
            loadCart();
        }
    } else {
        cart = [];
        saveCart();
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart page
function loadCart() {
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        cartContent.innerHTML = '';
    } else {
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        
        cartContent.innerHTML = `
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="quantity">Quantity: ${item.quantity}</p>
                            <p class="item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</p>
                        </div>
                        <div class="item-actions">
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        updateCartTotals();
    }
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 40;
    const total = subtotal + delivery;
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    
    // Update checkout page totals if on payment page
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = `₹${subtotal}`;
    if (checkoutTotal) checkoutTotal.textContent = `₹${total}`;
}

// Load checkout page
function loadCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'products.html';
        return;
    }
    
    const checkoutItems = document.getElementById('checkout-items');
    
    if (checkoutItems) {
        checkoutItems.innerHTML = cart.map(item => `
            <div class="checkout-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Quantity: ${item.quantity}</small>
                </div>
                <div>₹${item.price * item.quantity}</div>
            </div>
        `).join('');
        
        updateCartTotals();
    }
}

// Setup payment form validation
function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const mobile = document.getElementById('mobile').value;
            const address = document.getElementById('address').value;
            const area = document.getElementById('area').value;
            const payment = document.querySelector('input[name="payment"]:checked');
            
            // Validate all fields
            if (!name || !mobile || !address || !area || !payment) {
                alert('Please fill in all required fields!');
                return;
            }
            
            // Validate mobile number
            if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
                alert('Please enter a valid 10-digit mobile number!');
                return;
            }
            
            // All validations passed - proceed to thank you page
            window.location.href = 'thankyou.html';
        });
    }
}
