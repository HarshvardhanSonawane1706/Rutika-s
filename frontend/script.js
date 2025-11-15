// API Base URL - Change this to your backend URL
// Always call the backend deployed on Render:
const API_BASE_URL = "https://rutika-bakery.onrender.com/api";
 // Replace with your actual Render backend URL

// Zomato Integration Configuration
const ZOMATO_CONFIG = {
    baseUrl: 'https://www.zomato.com',
    restaurantName: 'Rutika\'s Bakery',
    defaultLocation: 'Nagpur',
    searchPath: '/search'
};

// Location settings
let currentLocation = ZOMATO_CONFIG.defaultLocation;

// Global variables
let currentUser = null;
let menuItems = [];
let userLocation = null;

// DOM Elements
const menuItemsContainer = document.querySelector('.menu-items');
const menuSection = document.querySelector('.menu-section');
const categoryButtons = document.querySelectorAll('.category-btn');
const loginBtn = document.getElementById('loginBtn');
const customerPanel = document.getElementById('customerPanel');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginLink = document.getElementById('adminLoginLink');

// Geolocation functionality
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log('User location obtained:', userLocation);
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
                // Fallback to default location
                userLocation = { latitude: null, longitude: null };
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    } else {
        console.warn('Geolocation not supported');
        userLocation = { latitude: null, longitude: null };
    }
}

// Zomato redirection functionality
function redirectToZomato(itemName) {
    const location = userLocation && userLocation.latitude && userLocation.longitude
        ? `${userLocation.latitude},${userLocation.longitude}`
        : ZOMATO_CONFIG.defaultLocation;

    const searchQuery = `${ZOMATO_CONFIG.restaurantName} ${itemName} ${location}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const zomatoUrl = `${ZOMATO_CONFIG.baseUrl}${ZOMATO_CONFIG.searchPath}?q=${encodedQuery}`;

    // Open Zomato in new tab/window
    window.open(zomatoUrl, '_blank');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMenuItems();
    setupEventListeners();
    checkAuthenticationStatus();
    getUserLocation();
});

// Setup event listeners
function setupEventListeners() {
    // Cart functionality - disabled for Zomato integration
    // cartIcon.addEventListener('click', () => {
    //     cartModal.classList.add('active');
    // });

    // closeCart.addEventListener('click', () => {
    //     cartModal.classList.remove('active');
    // });

    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            displayMenuItems(category);
        });
    });

    // Authentication
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            window.location.href = 'profile.html';
        } else {
            customerPanel.style.display = 'block';
            window.scrollTo({
                top: customerPanel.offsetTop,
                behavior: 'smooth'
            });
        }
    });

    // Admin login
    adminLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        adminLoginModal.classList.add('active');
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

    // Toggle between login and register forms
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    });

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            loadPanelContent(tabName);
        });
    });

    // Scroll indicator click to scroll to menu
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Load menu items from API
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        menuItems = await response.json();
        displayMenuItems();
    } catch (error) {
        console.error('Error loading menu items:', error);
        // Fallback to sample data if API is not available
        menuItems = getSampleMenuItems();
        displayMenuItems();
    }
}

// Display menu items
function displayMenuItems(category = 'all') {
    menuItemsContainer.innerHTML = '';

    const filteredItems = category === 'all'
        ? menuItems
        : menuItems.filter(item => item.category.toLowerCase() === category.toLowerCase());

    filteredItems.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.classList.add('menu-item');
        menuItemElement.setAttribute('data-category', item.category);
        menuItemElement.setAttribute('data-id', item._id || item.id);
        const imageUrl = item.image.startsWith('http') ? item.image : `assets/images/${item.image}`;
        menuItemElement.innerHTML = `
            <div class="item-image" style="background-image: url('${imageUrl}')"></div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <button class="order-btn" data-id="${item._id || item.id}">Order Now</button>
            </div>
        `;
        menuItemsContainer.appendChild(menuItemElement);
    });

    // Add event listeners to menu items for product details
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('order-btn')) {
                showProductModal(e.currentTarget.getAttribute('data-id'));
            }
        });
    });

    // Add event listeners to order buttons
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', orderOnZomato);
    });
}



// Handle user login
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = { token: data.token, ...data.user };
            localStorage.setItem('user', JSON.stringify(currentUser));
            showMessage('Login successful!', 'success');
            updateAuthUI();
            loadPanelContent('profile');
        } else {
            showMessage('Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Login failed. Please try again.', 'error');
    }
}

// Handle user registration
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            showMessage('Registration successful! Please login.', 'success');
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
        } else {
            showMessage('Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('Registration failed. Please try again.', 'error');
    }
}

// Handle admin login
async function handleAdminLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
        adminId: formData.get('adminId'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
            const admin = await response.json();
            localStorage.setItem('admin', JSON.stringify(admin));
            showMessage('Admin login successful!', 'success');
            adminLoginModal.classList.remove('active');
            // Redirect to admin panel (in a real app, this would navigate to a separate admin page)
            window.location.href = '/admin.html';
        } else {
            showMessage('Invalid admin credentials', 'error');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showMessage('Admin login failed. Please try again.', 'error');
    }
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login to complete your order', 'error');
        customerPanel.style.display = 'block';
        checkoutModal.classList.remove('active');
        return;
    }
    
    const orderData = {
        userId: currentUser.id,
        items: cart.map(item => ({
            productId: item._id || item.id,
            quantity: item.quantity,
            price: item.price
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryAddress: document.getElementById('checkoutAddress').value,
        phone: document.getElementById('checkoutPhone').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            showMessage('Order placed successfully!', 'success');
            cart = [];
            updateCart();
            checkoutModal.classList.remove('active');
            // In a real app, you might redirect to an order confirmation page
        } else {
            showMessage('Failed to place order. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage('Failed to place order. Please try again.', 'error');
    }
}

// Load panel content
function loadPanelContent(tabName) {
    const panelContent = document.querySelector('.panel-content');
    
    if (!currentUser) {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('profileContent').style.display = 'none';
        return;
    }
    
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('profileContent').style.display = 'block';
    
    let content = '';
    
    switch(tabName) {
        case 'profile':
            content = `
                <h3>My Profile</h3>
                <div class="profile-info">
                    <p><strong>Name:</strong> ${currentUser.name}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Phone:</strong> ${currentUser.phone}</p>
                    <button class="edit-profile-btn">Edit Profile</button>
                    <button class="logout-btn" style="margin-left: 10px;">Logout</button>
                </div>
            `;
            break;
        case 'orders':
            content = `
                <h3>Order History</h3>
                <div class="order-list" id="orderList">
                    <p>Loading orders...</p>
                </div>
            `;
            loadUserOrders();
            break;
        case 'addresses':
            content = `
                <h3>My Addresses</h3>
                <div class="address-list">
                    <div class="address-item">
                        <p><strong>Default Address</strong></p>
                        <p>${currentUser.address || 'No address saved'}</p>
                        <button class="edit-address-btn">Edit</button>
                    </div>
                </div>
                <button class="add-address-btn">Add New Address</button>
            `;
            break;
    }
    
    document.getElementById('profileContent').innerHTML = content;
    
    // Add event listeners for buttons in the panel
    if (document.querySelector('.logout-btn')) {
        document.querySelector('.logout-btn').addEventListener('click', handleLogout);
    }
}

// Load user orders
async function loadUserOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/user/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        });
        
        if (response.ok) {
            const orders = await response.json();
            const orderList = document.getElementById('orderList');
            
            if (orders.length === 0) {
                orderList.innerHTML = '<p>No orders found.</p>';
                return;
            }
            
            orderList.innerHTML = orders.map(order => `
                <div class="order-item">
                    <p><strong>Order #${order.id}</strong> - $${order.total.toFixed(2)} - ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Status: <span class="order-status">${order.status}</span></p>
                </div>
            `).join('');
        } else {
            document.getElementById('orderList').innerHTML = '<p>Failed to load orders.</p>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orderList').innerHTML = '<p>Failed to load orders.</p>';
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateAuthUI();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('profileContent').style.display = 'none';
}

// Check authentication status
function checkAuthenticationStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

// Update authentication UI
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const profileContent = document.getElementById('profileContent');

    if (currentUser) {
        if (loginBtn) loginBtn.textContent = 'My Account';
        if (loginForm) loginForm.style.display = 'none';
        if (profileContent) profileContent.style.display = 'block';
    } else {
        if (loginBtn) loginBtn.textContent = 'Login';
    }
}

// Handle logout for profile page
function handleProfileLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Initialize profile page
function initializeProfilePage() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleProfileLogout);
    }
    checkAuthenticationStatus();
    if (currentUser) {
        loadPanelContent('profile');
    } else {
        window.location.href = 'index.html';
    }
}

// Check if we're on the profile page
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', initializeProfilePage);
}

// Show message
function showMessage(message, type) {
    // Create message element
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
        messageEl.style.backgroundColor = 'var(--success)';
    } else {
        messageEl.style.backgroundColor = 'var(--error)';
    }
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 300);
    }, 3000);
}

// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) { 
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            const itemName = item.querySelector('.item-name').textContent.toLowerCase();
            const itemDescription = item.querySelector('.item-description').textContent.toLowerCase();
            const itemCategory = item.dataset.category ? item.dataset.category.toLowerCase() : '';

            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm) || itemCategory.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}



// Order on Zomato function
function orderOnZomato(e) {
    const itemId = e.target.getAttribute('data-id');
    const item = menuItems.find(menuItem => (menuItem._id || menuItem.id) === itemId);

    if (!item) {
        showMessage('Item not found', 'error');
        return;
    }

    // Redirect to Zomato with item and location
    redirectToZomato(item.name);

    // Show message to user
    showMessage(`Redirecting to Zomato for ${item.name}`, 'success');
}

// Show product details modal
function showProductModal(itemId) {
    const item = menuItems.find(menuItem => (menuItem._id || menuItem.id) === itemId);

    if (!item) {
        showMessage('Product not found', 'error');
        return;
    }

    // Create modal HTML
    const modalImageUrl = item.image.startsWith('http') ? item.image : `assets/images/${item.image}`;
    const modalHTML = `
        <div class="modal product-modal active">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="product-details">
                    <div class="product-image-large" style="background-image: url('${modalImageUrl}')"></div>
                    <div class="product-info">
                        <h2 class="product-title">${item.name}</h2>
                        <div class="product-meta">
                            <span class="product-category">${item.category}</span>
                        </div>
                        <div class="product-description-full">
                            <h3>About this product</h3>
                            <p>${item.description}</p>
                            <div class="product-ingredients">
                                <h4>Ingredients & Made with:</h4>
                                <p>${getProductIngredients(item.name)}</p>
                            </div>
                        </div>
                        <button class="order-btn" data-id="${item._id || item.id}">Order Now</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.querySelector('.product-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners
    const modal = document.querySelector('.product-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const orderBtn = modal.querySelector('.order-btn');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    orderBtn.addEventListener('click', orderOnZomato);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Get detailed ingredients information for products
function getProductIngredients(productName) {
    const ingredients = {
        "Chocolate Fudge Cake": "Made with premium dark chocolate, fresh butter, eggs, flour, sugar, cocoa powder, and vanilla extract. Topped with rich chocolate ganache.",
        "Red Velvet Cake": "Classic red velvet made with buttermilk, cocoa powder, red food coloring, cream cheese frosting, and topped with fresh berries.",
        "Fruit Tart": "Buttery pastry crust filled with vanilla custard, topped with seasonal fresh fruits including strawberries, kiwi, blueberries, and raspberries.",
        "Croissant": "Traditional French pastry made with laminated dough, butter, flour, milk, sugar, yeast, and a touch of salt for perfect flakiness.",
        "Sourdough Bread": "Artisan bread made with natural sourdough starter, high-protein flour, water, and sea salt. Naturally fermented for 24 hours.",
        "Whole Wheat Bread": "Healthy bread made with 100% whole wheat flour, oats, honey, yeast, and minimal natural sweeteners.",
        "Chocolate Chip Cookies": "Classic cookies made with premium chocolate chips, butter, brown sugar, vanilla extract, and a hint of sea salt.",
        "Macarons": "Delicate French macarons made with almond flour, powdered sugar, egg whites, and filled with various gourmet fillings."
    };

    return ingredients[productName] || "Made with premium ingredients and traditional baking techniques.";
}

// Sample menu items (fallback if API is not available)
function getSampleMenuItems() {
    return [
        {
            id: 1,
            name: "Chocolate Fudge Cake",
            category: "cakes",
            description: "Rich and moist chocolate cake with fudge frosting",
            image: "https://static01.nyt.com/images/2024/06/04/multimedia/Red-Velvet-Cake-twcf/Red-Velvet-Cake-twcf-mediumSquareAt3X.jpg"
        },
        {
            id: 2,
            name: "Red Velvet Cake",
            category: "cakes",
            description: "Classic red velvet with cream cheese frosting",
            image: "assets/images/red-velvet-cake.jpg"
        },
        {
            id: 3,
            name: "Fruit Tart",
            category: "pastries",
            description: "Buttery crust filled with custard and fresh fruits",
            image: "assets/images/fruit-tart.jpg"
        },
        {
            id: 4,
            name: "Croissant",
            category: "pastries",
            description: "Flaky, buttery French croissant",
            image: "assets/images/croissant.jpg"
        },
        {
            id: 5,
            name: "Sourdough Bread",
            category: "breads",
            description: "Artisan sourdough with crispy crust",
            image: "assets/images/sourdough-bread.jpg"
        },
        {
            id: 6,
            name: "Whole Wheat Bread",
            category: "breads",
            description: "Healthy whole wheat bread",
            image: "assets/images/whole-wheat-bread.jpg"
        },
        {
            id: 7,
            name: "Chocolate Chip Cookies",
            category: "cookies",
            description: "Classic cookies with chocolate chips",
            image: "assets/images/chocolate-chip-cookies.jpg"
        },
        {
            id: 8,
            name: "Macarons",
            category: "cookies",
            description: "Assorted French macarons",
            image: "assets/images/macarons.jpg"
        }
    ];
}
