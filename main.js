/* ==========================================================================
   STYLE WEAR - Interactive 3D & E-Commerce JavaScript Logic
   ========================================================================== */

// Sample Product Catalog (Men's & Women's Fashion)
const PRODUCTS = [
    {
        id: 1,
        title: "Obsidian Titanium Tailored Suit",
        category: "men",
        price: 28500, // LKR
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
        description: "Bespoke 3D-fitted Sri Lankan menswear featuring lightweight breathable wool blend, sharp lapels, and custom metallic lining.",
        badge: "3D Bestseller",
        colors: ["#0A0A0C", "#1E293B", "#334155"],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 2,
        title: "Silk Ethereal Runway Evening Dress",
        category: "women",
        price: 34000,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
        description: "High-couture natural silk gown with dramatic side slit, cascading silhouette, and hand-embroidered waist accent.",
        badge: "Runway Edition",
        colors: ["#FFFFFF", "#0A0A0C", "#C5A880"],
        sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 3,
        title: "Minimalist Linen Utility Jacket",
        category: "men",
        price: 16500,
        image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
        description: "100% Sri Lankan organic cotton-linen jacket designed for modern urban comfort with hidden tech pockets.",
        badge: "New Arrival",
        colors: ["#C5A880", "#1A1A22", "#475569"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4,
        title: "Sculptural Origami Wrap Blouse",
        category: "women",
        price: 14200,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
        description: "Avant-garde architectural wrap top tailored with structure-retaining cotton poplin for sleek corporate chic.",
        badge: "Featured",
        colors: ["#FFFFFF", "#D4AF37", "#0A0A0C"],
        sizes: ["XS", "S", "M", "L"]
    },
    {
        id: 5,
        title: "Urban Tech Slim Denim Jeans",
        category: "men",
        price: 12800,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
        description: "Premium Japanese stretch denim tailored with subtle ergonomic knees and reinforced stitching.",
        badge: "Essentials",
        colors: ["#1E293B", "#0A0A0C", "#64748B"],
        sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
        id: 6,
        title: "Asymmetric Pleated Midi Skirt",
        category: "women",
        price: 15900,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
        description: "Dynamic pleated skirt with metallic thread highlight and comfortable elasticized waist line.",
        badge: "Trending",
        colors: ["#D4AF37", "#0A0A0C", "#94A3B8"],
        sizes: ["XS", "S", "M", "L"]
    }
];

// Cart State Management
let shoppingBag = [];
let currentSelectedProduct = null;
let currentSelectedSize = 'M';
let currentSelectedColor = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initThreeJSHero();
    initThreeJSTryOn();
    renderProducts('all');
    setupEventListeners();
    updateCartUI();
});

/* --------------------------------------------------------------------------
   1. THREE.JS 3D HERO CANVAS ENGINE
   -------------------------------------------------------------------------- */
function initThreeJSHero() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3D Fashion Mannequin Mesh (Representational Geometry)
    const geometry = new THREE.IcosahedronGeometry(2.5, 2);
    const material = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        wireframe: true,
        metalness: 0.8,
        roughness: 0.2
    });
    const fashionCore = new THREE.Mesh(geometry, material);
    scene.add(fashionCore);

    // Floating Particles
    const particlesGeo = new THREE.BufferGeometry();
    const count = 300;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.6
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Dramatic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 6;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        fashionCore.rotation.x += 0.003;
        fashionCore.rotation.y += 0.005;
        particleSystem.rotation.y -= 0.001;
        renderer.render(scene, camera);
    }
    animate();

    // Window Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

/* --------------------------------------------------------------------------
   2. THREE.JS VIRTUAL TRY-ON 360 STAGE
   -------------------------------------------------------------------------- */
function initThreeJSTryOn() {
    const canvas = document.getElementById('tryonCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // 3D Fashion Torso Silhouette
    const torsoGeo = new THREE.CylinderGeometry(1, 0.7, 2.8, 32);
    const torsoMat = new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.3,
        metalness: 0.7
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    scene.add(torso);

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(2, 4, 3);
    scene.add(light);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    camera.position.z = 4.5;

    // Drag to Rotate
    let isDragging = false;
    let previousMouseX = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => isDragging = false);

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMouseX;
        torso.rotation.y += deltaX * 0.01;
        previousMouseX = e.clientX;
    });

    function renderLoop() {
        requestAnimationFrame(renderLoop);
        if (!isDragging) torso.rotation.y += 0.003;
        renderer.render(scene, camera);
    }
    renderLoop();
}

/* --------------------------------------------------------------------------
   3. PRODUCT RENDERING & CATEGORY TABS
   -------------------------------------------------------------------------- */
function renderProducts(filterCategory) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = filterCategory === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === filterCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-category="${p.category}">
            <div class="product-image-wrap">
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                <span class="badge-3d">${p.badge}</span>
                <div class="product-actions-overlay">
                    <button class="quick-view-btn" onclick="open360Modal(${p.id})">
                        <i class="fa-solid fa-eye"></i> 360° PREVIEW
                    </button>
                    <button class="quick-view-btn" onclick="quickAddToBag(${p.id})">
                        <i class="fa-solid fa-plus"></i> ADD TO BAG
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${p.category === 'men' ? "Men's Line" : "Women's Line"}</span>
                <h3 class="product-title">${p.title}</h3>
                <div class="product-price">LKR ${p.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

/* --------------------------------------------------------------------------
   4. 360-DEGREE PRODUCT PREVIEW MODAL
   -------------------------------------------------------------------------- */
function open360Modal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentSelectedProduct = product;
    currentSelectedSize = product.sizes[0];
    currentSelectedColor = product.colors[0];

    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <div class="modal-preview-stage">
            <img src="${product.image}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover;">
            <div class="tryon-badge"><i class="fa-solid fa-cube"></i> Interactive 3D Model Render</div>
        </div>
        <div class="modal-details">
            <span class="section-tag">${product.badge}</span>
            <h2>${product.title}</h2>
            <div class="product-price" style="font-size:24px; margin: 12px 0;">LKR ${product.price.toLocaleString()}</div>
            <p style="color: var(--text-secondary); font-size:14px;">${product.description}</p>
            
            <div class="option-group">
                <span class="option-label">Select Size:</span>
                <div class="size-selector">
                    ${product.sizes.map(s => `
                        <button class="size-btn ${s === currentSelectedSize ? 'active' : ''}" onclick="selectSize('${s}', this)">${s}</button>
                    `).join('')}
                </div>
            </div>

            <div class="option-group">
                <span class="option-label">Color Swatch:</span>
                <div class="color-selector">
                    ${product.colors.map((c, idx) => `
                        <div class="color-dot ${idx === 0 ? 'active' : ''}" style="background:${c};" onclick="selectColor('${c}', this)"></div>
                    `).join('')}
                </div>
            </div>

            <button class="btn btn-primary full-width" onclick="addModalItemToBag()" style="margin-top:20px;">
                <i class="fa-solid fa-bag-shopping"></i> ADD TO BAG
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function selectSize(size, btn) {
    currentSelectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function selectColor(color, dot) {
    currentSelectedColor = color;
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
}

function addModalItemToBag() {
    if (!currentSelectedProduct) return;

    addToBagState(
        currentSelectedProduct,
        currentSelectedSize,
        currentSelectedColor,
        1
    );

    document.getElementById('productModal').classList.remove('active');
    showToastNotification("YOUR ITEM HAS BEEN ADDED TO YOUR BAG!");
}

function quickAddToBag(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
        addToBagState(product, product.sizes[0], product.colors[0], 1);
        showToastNotification("YOUR ITEM HAS BEEN ADDED TO YOUR BAG!");
    }
}

/* --------------------------------------------------------------------------
   5. CART STATE & SLIDING DRAWER UI
   -------------------------------------------------------------------------- */
function addToBagState(product, size, color, qty) {
    const existingIndex = shoppingBag.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
        shoppingBag[existingIndex].quantity += qty;
    } else {
        shoppingBag.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: qty
        });
    }

    updateCartUI();
    openCartDrawer();
}

function updateCartUI() {
    const countBadge = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartSubtotal = document.getElementById('cartSubtotal');

    const totalCount = shoppingBag.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = shoppingBag.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (countBadge) countBadge.textContent = totalCount;
    if (cartSubtotal) cartSubtotal.textContent = `LKR ${subtotal.toLocaleString()}`;

    if (!cartBody) return;

    if (shoppingBag.length === 0) {
        cartBody.innerHTML = `
            <div class="text-center" style="padding: 40px 0; color: var(--text-secondary);">
                <i class="fa-solid fa-bag-shopping" style="font-size: 36px; margin-bottom: 12px; color: var(--border-color);"></i>
                <p>Your shopping bag is empty.</p>
            </div>
        `;
    } else {
        cartBody.innerHTML = shoppingBag.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-meta">Size: ${item.size} | Qty: ${item.quantity}</div>
                    <div class="cart-item-price">LKR ${(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <button onclick="removeFromCart(${idx})" style="background:none; color:var(--text-secondary); cursor:pointer;">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }
}

function removeFromCart(index) {
    shoppingBag.splice(index, 1);
    updateCartUI();
}

function openCartDrawer() {
    document.getElementById('cartOverlay')?.classList.add('active');
    document.getElementById('cartDrawer')?.classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('active');
    document.getElementById('cartDrawer')?.classList.remove('active');
}

function showToastNotification(message) {
    const toast = document.getElementById('toastNotification');
    const msg = document.getElementById('toastMessage');
    if (!toast) return;

    if (msg) msg.textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3500);
}

/* --------------------------------------------------------------------------
   6. EVENT LISTENERS & CHECKOUT
   -------------------------------------------------------------------------- */
function setupEventListeners() {
    // Category Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProducts(e.target.dataset.filter);
        });
    });

    // Cart Drawer Controls
    document.getElementById('bagBtn')?.addEventListener('click', openCartDrawer);
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCartDrawer);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCartDrawer);

    // Modal Close Controls
    document.getElementById('closeModalBtn')?.addEventListener('click', () => {
        document.getElementById('productModal').classList.remove('active');
    });

    // Mobile Nav Toggle
    document.getElementById('mobileToggle')?.addEventListener('click', () => {
        const nav = document.getElementById('navMenu');
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Order Submission Form
    document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (shoppingBag.length === 0) {
            alert('Your shopping bag is empty. Please add items before placing an order.');
            return;
        }

        const name = document.getElementById('custName').value;
        const address = document.getElementById('custAddress').value;
        const phone = document.getElementById('custPhone').value;
        const payment = document.getElementById('custPayment').value;

        alert(`ORDER CONFIRMED!\n\nThank you, ${name}.\nYour order has been placed successfully.\nDelivery Address: ${address}\nContact: ${phone}\nPayment Method: ${payment.toUpperCase()}\n\nWe will contact you shortly via SMS/WhatsApp.`);

        shoppingBag = [];
        updateCartUI();
        closeCartDrawer();
    });
}
