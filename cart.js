class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            // Show message that item is already in cart
            if (typeof showToast === 'function') {
                showToast('Item is already in cart!', 'info');
            } else {
                alert('Item is already in cart!');
            }
            return false;
        } else {
            this.items.push({...product, quantity: 1});
            this.updateTotal();
            this.saveCart();
            this.updateCartUI();
            return true;
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.updateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        localStorage.setItem('cartTotal', this.total);
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateTotal();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartItems = document.getElementById('cartItems');

        const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartTotal.textContent = `₹${this.total.toFixed(2)}`;

        if (cartItems) {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 80px; height: 80px; object-fit: contain; background-color: #f8f9fa; padding: 5px; border-radius: 8px;">
                    <div class="cart-item-details">
                        <h6>${item.name}</h6>
                        <p>₹${item.price} × 
                            <input type="number" value="${item.quantity}" min="1" 
                                onchange="cart.updateQuantity('${item.id}', this.value)">
                        </p>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="cart.removeItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.saveCart();
        this.updateCartUI();
    }
}


