// Initialize cart
const cart = new ShoppingCart();

// Load cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    cart.loadCart();
});

// Add to cart function
function addToCart(productId, name, price, image) {
    // Disable the clicked button temporarily
    const clickedButton = event.target;
    clickedButton.disabled = true;
    
    const added = cart.addItem({ id: productId, name, price, image });
    
    if (added) {
        showToast('Product added to cart!');
        
        // Enable the button after 1 second
        setTimeout(() => {
            clickedButton.disabled = false;
        }, 1000);
    } else {
        // Enable the button immediately if item wasn't added
        clickedButton.disabled = false;
    }
}

// Show checkout modal
function showCheckoutModal() {
    if (cart.items.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Place order
function placeOrder(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const orderData = {
        items: cart.items,
        total: cart.total,
        customer: Object.fromEntries(formData.entries()),
        orderDate: new Date().toISOString(),
        orderId: generateOrderId()
    };

    // Save order to localStorage (in a real app, this would go to a server)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart and show confirmation
    cart.clearCart();
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    showOrderConfirmation(orderData);
}

// Generate order ID
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Show order confirmation and feedback form
function showOrderConfirmation(orderData) {
    Swal.fire({
        title: 'Order Placed Successfully!',
        html: `
            <div class="order-confirmation">
                <p>Order ID: ${orderData.orderId}</p>
                <p>Total Amount: ₹${orderData.total.toFixed(2)}</p>
                <p>We'll send the order details to: ${orderData.customer.email}</p>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'Give Feedback',
    }).then((result) => {
        if (result.isConfirmed) {
            const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
            feedbackModal.show();
        }
    });
}

// Submit feedback
function submitFeedback(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const feedbackData = {
        rating: formData.get('rating'),
        comments: formData.get('comments'),
        date: new Date().toISOString()
    };

    // Save feedback to localStorage
    const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    feedback.push(feedbackData);
    localStorage.setItem('feedback', JSON.stringify(feedback));

    // Show confirmation and close modal
    const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
    feedbackModal.hide();
    
    // Show thank you message
    Swal.fire({
        title: 'Thank You!',
        text: 'Your feedback has been submitted successfully.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
    });

    // Reset the form
    event.target.reset();
}

// Utility function to show toast messages
function showToast(message, type = 'success') {
    Swal.fire({
        text: message,
        icon: type,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}



