// Admin Panel JavaScript
const API_BASE_URL = 'http://localhost:3000/api';

// Admin authentication check
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupAdminEventListeners();
});

// Check if admin is logged in
function checkAdminAuth() {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
        window.location.href = 'index.html';
        return;
    }

    // Load initial data
    loadProducts();
    loadOrders();
    loadUsers();
}

// Setup event listeners
function setupAdminEventListeners() {
    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });

    // Add product button
    document.querySelector('.add-product-btn').addEventListener('click', () => {
        document.getElementById('addProductModal').classList.add('active');
    });

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Form submissions
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleAdminLogout);
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        const products = await response.json();

        const productsList = document.getElementById('productsList');
        productsList.innerHTML = '';

        if (products.length === 0) {
            productsList.innerHTML = '<p>No products found.</p>';
            return;
        }

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('admin-product-item');
            productElement.innerHTML = `
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>${product.category}</p>
                    <p>${product.description}</p>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" data-id="${product._id}">Edit</button>
                    <button class="delete-btn" data-id="${product._id}">Delete</button>
                </div>
            `;
            productsList.appendChild(productElement);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                openEditModal(productId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                deleteProduct(productId);
            });
        });

    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsList').innerHTML = '<p>Error loading products.</p>';
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const orders = await response.json();

        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<p>No orders found.</p>';
            return;
        }

        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('admin-order-item');
            orderElement.innerHTML = `
                <div class="order-info">
                    <h4>Order #${order._id}</h4>
                    <p>Customer: ${order.userId?.name || 'N/A'}</p>
                    <p>Total: ₹${order.totalAmount || 0}</p>
                    <p>Status: <span class="status-${order.status}">${order.status}</span></p>
                </div>
                <div class="order-actions">
                    <select class="status-select" data-id="${order._id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            `;
            ordersList.appendChild(orderElement);
        });

        // Add event listeners to status selects
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const orderId = e.target.getAttribute('data-id');
                const newStatus = e.target.value;
                updateOrderStatus(orderId, newStatus);
            });
        });

    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersList').innerHTML = '<p>Error loading orders.</p>';
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();

        const usersList = document.getElementById('usersList');
        usersList.innerHTML = '';

        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found.</p>';
            return;
        }

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('admin-user-item');
            userElement.innerHTML = `
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    <p>${user.phone}</p>
                </div>
            `;
            usersList.appendChild(userElement);
        });

    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = '<p>Error loading users.</p>';
    }
}

// Handle add product
async function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        image: formData.get('image')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showMessage('Product added successfully!', 'success');
            document.getElementById('addProductModal').classList.remove('active');
            e.target.reset();
            loadProducts();
        } else {
            showMessage('Failed to add product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showMessage('Failed to add product', 'error');
    }
}

// Handle edit product
async function handleEditProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('id');
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        image: formData.get('image')
    };

    try {
        const response = await fetch(`${API_BASE_URL}/menu/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showMessage('Product updated successfully!', 'success');
            document.getElementById('editProductModal').classList.remove('active');
            loadProducts();
        } else {
            showMessage('Failed to update product', 'error');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showMessage('Failed to update product', 'error');
    }
}

// Open edit modal
async function openEditModal(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/menu/${productId}`);
        const product = await response.json();

        document.getElementById('editProductId').value = product._id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductImage').value = product.image;

        document.getElementById('editProductModal').classList.add('active');
    } catch (error) {
        console.error('Error loading product:', error);
        showMessage('Failed to load product', 'error');
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/menu/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showMessage('Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showMessage('Failed to delete product', 'error');
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showMessage('Order status updated successfully!', 'success');
        } else {
            showMessage('Failed to update order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showMessage('Failed to update order status', 'error');
    }
}

// Handle admin logout
function handleAdminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = 'index.html';
}

// Show message
function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    if (type === 'success') {
        messageEl.style.backgroundColor = '#28a745';
    } else {
        messageEl.style.backgroundColor = '#dc3545';
    }

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}
