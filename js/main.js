// Use global products data from products.js
(function () {
    const products = window.perfumeProducts || [];

    document.addEventListener('DOMContentLoaded', () => {
        // Navbar Scroll Effect
        const nav = document.getElementById('mainNav');
        if (nav) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            });
        }

        // Mobile Menu Auto-Close
        const navLinks = document.querySelectorAll('.nav-link');
        const menuCollapse = document.getElementById('navbarContent');
        if (menuCollapse && typeof bootstrap !== 'undefined') {
            const bsCollapse = new bootstrap.Collapse(menuCollapse, { toggle: false });

            navLinks.forEach((l) => {
                l.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        bsCollapse.hide();
                    }
                });
            });
        }

        // Shared Intersection Observer for all reveals
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const globalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Function to observe elements
        window.revealElements = () => {
            document.querySelectorAll('.fade-up, .reveal-right').forEach(el => {
                if (!el.classList.contains('visible')) {
                    globalObserver.observe(el);
                }
            });
        };

        // Initial observe
        revealElements();

        // Inject Featured Products (Index Page)
        const featuredGrid = document.getElementById('featured-products');
        if (featuredGrid) {
            const featured = products.slice(0, 3);
            renderProducts(featured, featuredGrid, 'col-md-4');
        }

        // Inject All Products (Collection Page)
        const shopGrid = document.getElementById('shop-grid');
        if (shopGrid) {
            renderProducts(products, shopGrid, 'col-lg-4 col-md-6');
        }

        // Product Detail Logic
        const detailContainer = document.getElementById('product-detail-container');
        if (detailContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            const product = products.find(p => p.id === productId);

            if (product) {
                renderProductDetail(product);
            } else {
                window.location.href = 'collection.html';
            }
        }

        // Initialize Ordering Modal
        initOrderModal();
    });

    function initOrderModal() {
        const modalHtml = `
        <div class="modal fade luxury-modal" id="orderModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Complete Your Order</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="order-summary-box">
                            <p class="small text-gold mb-1 text-uppercase tracking-widest">Selected Essence</p>
                            <h4 class="serif mb-0" id="modalProductName">Product Name</h4>
                            <p class="mb-0 mt-2" id="modalProductDetails">Quantity: 1 | Total: PKR 0</p>
                        </div>
                        
                        <form id="orderForm">
                            <div class="mb-4">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="userName" placeholder="Enter your name" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label">Delivery City</label>
                                <input type="text" class="form-control" id="userCity" placeholder="e.g. Lahore, Karachi" required>
                            </div>
                            <div class="mb-0">
                                <label class="form-label">Phone Number (Optional)</label>
                                <input type="tel" class="form-control" id="userPhone" placeholder="For delivery coordination">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn-gold-fill w-100" onclick="window.submitOrderToWhatsApp()">Place Order on WhatsApp</button>
                    </div>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    let currentOrderData = {};

    window.openOrderModal = (name, price, qty) => {
        currentOrderData = { name, price, qty };
        document.getElementById('modalProductName').innerText = name;
        document.getElementById('modalProductDetails').innerText = `Quantity: ${qty} | Total: ${price}`;

        const modal = new bootstrap.Modal(document.getElementById('orderModal'));
        modal.show();
    };

    window.submitOrderToWhatsApp = () => {
        const name = document.getElementById('userName').value.trim();
        const city = document.getElementById('userCity').value.trim();
        const phone = document.getElementById('userPhone').value.trim();

        if (!name || !city) {
            alert('Please fill in your name and city to proceed.');
            return;
        }

        const message = encodeURIComponent(`*NEW ORDER FROM AL-HADI WEBSITE*
-------------------------------
*Product:* ${currentOrderData.name}
*Quantity:* ${currentOrderData.qty}
*Total Price:* ${currentOrderData.price}

*Customer Details:*
-------------------------------
*Name:* ${name}
*City:* ${city}
${phone ? `*Phone:* ${phone}` : ''}

_Please confirm my order. Thank you!_`);

        const waLink = `https://wa.me/923096273676?text=${message}`;
        window.location.href = waLink;
    };

    function renderProducts(items, container, colClass) {
        container.innerHTML = items.map(product => `
        <div class="${colClass}">
            <div class="product-card fade-up">
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x800/1a1a1a/C5A059?text=${product.name.replace(/ /g, '+')}'">
                </div>
                <div class="product-info">
                    <span class="category">${product.category}</span>
                    <h3 class="serif">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                    <a href="product-detail.html?id=${product.id}" class="btn-minimal">View Essence</a>
                </div>
            </div>
        </div>
    `).join('');

        // Re-observe new elements
        if (window.revealElements) window.revealElements();
    }

    function renderProductDetail(product) {
        const detailContainer = document.getElementById('product-detail-container');
        const waMessage = encodeURIComponent(`Hello Al-Hadi Perfumes, I would like to order:
Product: ${product.name}
Quantity: 1
Price: ${product.price}

Please let me know the next steps.`);

        const waLink = `https://wa.me/923096273676?text=${waMessage}`;

        detailContainer.innerHTML = `
        <div class="row align-items-center gy-5">
            <div class="col-lg-6">
                <div class="detail-img fade-up">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/800x1000/1a1a1a/C5A059?text=${product.name.replace(/ /g, '+')}'">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="detail-info fade-up">
                    <span class="subtitle mb-2">${product.category}</span>
                    <h1 class="serif display-4 mb-3">${product.name}</h1>
                    <p class="detail-price serif">${product.price}</p>
                    <p class="text-muted mb-5 lead">${product.description}</p>
                    
                    <div class="scent-notes">
                        <div class="note-item">
                            <span class="text-gold small tracking-widest text-uppercase d-block mb-1">Top Notes</span>
                            <p class="mb-0">${product.topNotes}</p>
                        </div>
                        <div class="note-item">
                            <span class="text-gold small tracking-widest text-uppercase d-block mb-1">Heart Notes</span>
                            <p class="mb-0">${product.heartNotes}</p>
                        </div>
                        <div class="note-item">
                            <span class="text-gold small tracking-widest text-uppercase d-block mb-1">Base Notes</span>
                            <p class="mb-0">${product.baseNotes}</p>
                        </div>
                    </div>

                    <div class="row mb-5 text-muted small tracking-widest text-uppercase">
                        <div class="col-6">
                            <strong>Longevity:</strong> ${product.longevity}
                        </div>
                        <div class="col-6">
                            <strong>Occasion:</strong> ${product.occasion}
                        </div>
                    </div>

                    <div class="order-section">
                        <div class="quantity-selector">
                            <button type="button" class="minus">-</button>
                            <input type="number" id="qty" value="1" min="1" readonly>
                            <button type="button" class="plus">+</button>
                        </div>
                        <button type="button" id="btn-order-modal" class="whatsapp-btn-full border-0">Order on WhatsApp</button>
                    </div>
                </div>
            </div>
        </div>
    `;

        // Quantity Logic
        const qtyInput = document.getElementById('qty');

        const handleOrderClick = () => {
            const val = qtyInput.value;
            const basePrice = parseInt(product.price.replace(/[^\d]/g, ''));
            const totalPrice = `PKR ${(basePrice * val).toLocaleString()}`;
            window.openOrderModal(product.name, totalPrice, val);
        };

        if (document.getElementById('btn-order-modal')) {
            document.getElementById('btn-order-modal').addEventListener('click', handleOrderClick);
        }

        if (document.querySelector('.plus')) {
            document.querySelector('.plus').addEventListener('click', () => {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            });
        }

        if (document.querySelector('.minus')) {
            document.querySelector('.minus').addEventListener('click', () => {
                if (parseInt(qtyInput.value) > 1) {
                    qtyInput.value = parseInt(qtyInput.value) - 1;
                }
            });
        }

        // Re-observe new elements
        if (window.revealElements) window.revealElements();
    }
})();
