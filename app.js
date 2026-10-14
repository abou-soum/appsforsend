/**
 * ==============================================================================
 * StockFacile - Application de gestion de stock et de ventes
 * Téléphonie et Accessoires
 *
 * Conçu spécialement pour être simple, clair et facile à comprendre pour un débutant.
 * Les données sont stockées dans le navigateur grâce à localStorage.
 * ==============================================================================
 */

// ==========================================
// 1. ÉTAT GLOBAL ET GESTION DU LOCALSTORAGE
// ==========================================

// Clés utilisées pour enregistrer dans le navigateur (localStorage)
const STORAGE_KEYS = {
    PRODUCTS: 'stockfacile_products',
    SALES: 'stockfacile_sales'
};

// Variables en mémoire qui contiennent nos données
let products = [];
let sales = [];

/**
 * Charge les données depuis le localStorage du navigateur.
 * Au premier lancement, les listes sont vides (0 données fictives).
 */
function loadData() {
    try {
        const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);

        products = storedProducts ? JSON.parse(storedProducts) : [];
        sales = storedSales ? JSON.parse(storedSales) : [];
    } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        products = [];
        sales = [];
    }
}

/**
 * Sauvegarde les produits et les ventes dans le localStorage
 */
function saveProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function saveSales() {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
}


// ==========================================
// 2. FONCTIONS UTILITAIRES (FORMATAGE)
// ==========================================

/**
 * Formate un nombre en Francs CFA (ex: 15000 -> "15 000 FCFA")
 */
function formatFCFA(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return "0 FCFA";
    const formatted = new Intl.NumberFormat('fr-FR').format(Math.round(amount));
    return `${formatted} FCFA`;
}

/**
 * Formate une date ISO en format lisible en français
 * Exemple : "14/10/2026 à 14:35"
 */
function formatDateTime(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
}

/**
 * Formate uniquement l'heure (ex: 14:35)
 */
function formatTimeOnly(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Vérifie si une date correspond à aujourd'hui
 */
function isToday(isoString) {
    const d = new Date(isoString);
    const now = new Date();
    return d.getDate() === now.getDate() &&
           d.getMonth() === now.getMonth() &&
           d.getFullYear() === now.getFullYear();
}

/**
 * Affiche une petite notification (Toast) en bas de l'écran
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}


// ==========================================
// 3. NAVIGATION PAR ONGLETS
// ==========================================

function switchTab(tabId) {
    // 1. Met à jour les boutons de navigation (desktop et mobile)
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Affiche le bon onglet
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
        targetPane.classList.add('active');
    }

    // 3. Rafraîchit les vues si nécessaire
    if (tabId === 'dashboard') {
        renderDashboard();
    } else if (tabId === 'products') {
        renderProductsTable();
    } else if (tabId === 'sales') {
        initSaleForm();
    } else if (tabId === 'history') {
        renderSalesHistory();
    }

    // Fait défiler la page vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Écouteurs sur les boutons de navigation
document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
    });
});

// Bouton raccourci "Vendre" dans l'en-tête
const quickSaleBtn = document.getElementById('open-new-sale-quick');
if (quickSaleBtn) {
    quickSaleBtn.addEventListener('click', () => switchTab('sales'));
}


// ==========================================
// 4. GESTION DU TABLEAU DE BORD (DASHBOARD)
// ==========================================

function renderDashboard() {
    // Affiche la date actuelle dans le badge d'en-tête
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('fr-FR', dateOptions);
    const dateBadge = document.getElementById('current-date-badge');
    if (dateBadge) {
        dateBadge.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    // 1. Calcul des statistiques du jour
    const todaySalesList = sales.filter(s => isToday(s.date));
    const todayTotalCA = todaySalesList.reduce((sum, s) => sum + (s.totalSale || 0), 0);
    const todayTotalProfit = todaySalesList.reduce((sum, s) => sum + (s.totalProfit || 0), 0);
    const todaySalesCount = todaySalesList.length;

    // Mise à jour des cartes KPI
    document.getElementById('kpi-today-sales').textContent = formatFCFA(todayTotalCA);
    document.getElementById('kpi-today-profit').textContent = formatFCFA(todayTotalProfit);
    document.getElementById('kpi-today-count').textContent = `${todaySalesCount} vente${todaySalesCount > 1 ? 's' : ''} aujourd'hui`;

    // 2. Statistiques d'inventaire
    const totalProductsCount = products.length;
    const totalUnitsCount = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    const totalStockValue = products.reduce((sum, p) => sum + ((Number(p.quantity) || 0) * (Number(p.buyPrice) || 0)), 0);

    document.getElementById('kpi-total-products').textContent = totalProductsCount;
    document.getElementById('kpi-total-units').textContent = `${totalUnitsCount} article${totalUnitsCount > 1 ? 's' : ''} en stock`;
    document.getElementById('kpi-stock-value').textContent = formatFCFA(totalStockValue);

    // 3. Gestion des alertes de stock faible
    renderStockAlerts();

    // 4. Dernières ventes récentes (5 dernières)
    renderRecentSales();
}

/**
 * Affiche la bannière d'alerte si des produits ont un stock critique
 */
function renderStockAlerts() {
    const alertBox = document.getElementById('dashboard-stock-alerts');
    const alertList = document.getElementById('alert-items-list');
    const alertSummary = document.getElementById('alert-summary-text');

    // Trouver les produits dont le stock <= seuil d'alerte (minStock)
    const criticalProducts = products.filter(p => Number(p.quantity) <= Number(p.minStock || 3));

    if (criticalProducts.length === 0) {
        alertBox.classList.add('hidden');
        alertList.innerHTML = '';
        return;
    }

    // Afficher l'alerte
    alertBox.classList.remove('hidden');
    alertSummary.textContent = `${criticalProducts.length} produit${criticalProducts.length > 1 ? 's' : ''} nécessite${criticalProducts.length > 1 ? 'nt' : ''} un réapprovisionnement :`;

    alertList.innerHTML = criticalProducts.map(p => {
        const isOutOfStock = Number(p.quantity) <= 0;
        const tagClass = isOutOfStock ? 'alert-tag critical' : 'alert-tag';
        const label = isOutOfStock ? 'RUPTURE (0 restant)' : `Reste ${p.quantity} (Seuil : ${p.minStock})`;
        return `
            <span class="${tagClass}">
                <strong>${escapeHtml(p.name)}</strong> : ${label}
            </span>
        `;
    }).join('');
}

/**
 * Affiche les 5 dernières ventes dans le tableau de bord
 */
function renderRecentSales() {
    const tbody = document.getElementById('recent-sales-tbody');
    const emptyState = document.getElementById('recent-sales-empty');

    if (sales.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    // Trier les ventes par date décroissante et prendre les 5 premières
    const recent = [...sales].reverse().slice(0, 5);

    tbody.innerHTML = recent.map(sale => `
        <tr>
            <td>
                <strong>${formatTimeOnly(sale.date)}</strong>
                <div class="text-sm text-muted">${new Date(sale.date).toLocaleDateString('fr-FR')}</div>
            </td>
            <td><strong>${escapeHtml(sale.productName)}</strong></td>
            <td><span class="badge badge-neutral">${sale.quantity}</span></td>
            <td><strong class="text-blue">${formatFCFA(sale.totalSale)}</strong></td>
            <td><span class="font-bold text-emerald">+${formatFCFA(sale.totalProfit)}</span></td>
        </tr>
    `).join('');
}


// ==========================================
// 5. GESTION DES PRODUITS & INVENTAIRE (CRUD)
// ==========================================

/**
 * Affiche la liste des produits dans le tableau de gestion
 */
function renderProductsTable() {
    const tbody = document.getElementById('products-tbody');
    const emptyState = document.getElementById('products-empty');
    const searchTerm = (document.getElementById('product-search').value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('product-filter-category').value;
    const stockFilter = document.getElementById('product-filter-stock').value;

    // Filtrer les produits
    let filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm) ||
                            p.category.toLowerCase().includes(searchTerm);
        const matchCat = categoryFilter === 'ALL' || p.category === categoryFilter;

        let matchStock = true;
        const qty = Number(p.quantity);
        const min = Number(p.minStock || 3);

        if (stockFilter === 'OUT') {
            matchStock = qty <= 0;
        } else if (stockFilter === 'ALERT') {
            matchStock = qty <= min && qty > 0;
        } else if (stockFilter === 'IN_STOCK') {
            matchStock = qty > min;
        }

        return matchSearch && matchCat && matchStock;
    });

    if (products.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted" style="padding: 2rem;">
                    Aucun produit ne correspond à votre recherche.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(p => {
        const buyPrice = Number(p.buyPrice) || 0;
        const sellPrice = Number(p.sellPrice) || 0;
        const unitMargin = sellPrice - buyPrice;
        const qty = Number(p.quantity);
        const minStock = Number(p.minStock || 3);

        // Détermination du badge de stock
        let statusBadge = '';
        if (qty <= 0) {
            statusBadge = `<span class="badge badge-danger"><span class="badge-dot"></span> Rupture</span>`;
        } else if (qty <= minStock) {
            statusBadge = `<span class="badge badge-warning"><span class="badge-dot"></span> Faible (${qty})</span>`;
        } else {
            statusBadge = `<span class="badge badge-success"><span class="badge-dot"></span> En stock (${qty})</span>`;
        }

        return `
            <tr>
                <td>
                    <strong>${escapeHtml(p.name)}</strong>
                </td>
                <td><span class="badge badge-neutral">${escapeHtml(p.category)}</span></td>
                <td>${formatFCFA(buyPrice)}</td>
                <td><strong class="text-blue">${formatFCFA(sellPrice)}</strong></td>
                <td>
                    <span class="font-bold ${unitMargin >= 0 ? 'text-emerald' : 'text-danger'}">
                        ${unitMargin >= 0 ? '+' : ''}${formatFCFA(unitMargin)}
                    </span>
                </td>
                <td>
                    <strong style="font-size: 1.05rem;">${qty}</strong>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" title="Réapprovisionner le stock (+)" onclick="openRestockModal('${p.id}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <button class="action-btn" title="Modifier le produit" onclick="openEditProductModal('${p.id}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn delete-btn" title="Supprimer" onclick="deleteProduct('${p.id}')">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filtres de recherche des produits
document.getElementById('product-search').addEventListener('input', renderProductsTable);
document.getElementById('product-filter-category').addEventListener('change', renderProductsTable);
document.getElementById('product-filter-stock').addEventListener('change', renderProductsTable);


// ==========================================
// 6. MODAL PRODUIT (AJOUT / MODIFICATION)
// ==========================================

function openAddProductModal() {
    document.getElementById('modal-product-title').textContent = "Ajouter un nouveau produit";
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = "";
    document.getElementById('product-min-stock').value = "3";
    updateMarginPreview();
    document.getElementById('product-modal').classList.add('show');
}

function openEditProductModal(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('modal-product-title').textContent = "Modifier le produit";
    document.getElementById('product-id').value = prod.id;
    document.getElementById('product-name').value = prod.name;
    document.getElementById('product-category').value = prod.category;
    document.getElementById('product-buy-price').value = prod.buyPrice;
    document.getElementById('product-sell-price').value = prod.sellPrice;
    document.getElementById('product-quantity').value = prod.quantity;
    document.getElementById('product-min-stock').value = prod.minStock || 3;

    updateMarginPreview();
    document.getElementById('product-modal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
}

// Calcul dynamique du bénéfice unitaire lors de la saisie
function updateMarginPreview() {
    const buy = parseFloat(document.getElementById('product-buy-price').value) || 0;
    const sell = parseFloat(document.getElementById('product-sell-price').value) || 0;
    const margin = sell - buy;
    const marginEl = document.getElementById('margin-calc-value');

    marginEl.textContent = formatFCFA(margin);
    if (margin < 0) {
        marginEl.style.color = 'var(--danger)';
    } else {
        marginEl.style.color = 'var(--primary)';
    }
}

document.getElementById('product-buy-price').addEventListener('input', updateMarginPreview);
document.getElementById('product-sell-price').addEventListener('input', updateMarginPreview);

// Soumission du formulaire Produit (Ajout ou Modification)
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const buyPrice = parseFloat(document.getElementById('product-buy-price').value);
    const sellPrice = parseFloat(document.getElementById('product-sell-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value, 10);
    const minStock = parseInt(document.getElementById('product-min-stock').value, 10) || 3;

    // Validation
    if (!name || !category || isNaN(buyPrice) || isNaN(sellPrice) || isNaN(quantity)) {
        showToast("Veuillez renseigner tous les champs obligatoires.", "error");
        return;
    }

    if (id) {
        // Mode Modification
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                buyPrice,
                sellPrice,
                quantity,
                minStock,
                updatedAt: new Date().toISOString()
            };
            showToast(`Produit "${name}" modifié avec succès !`, "success");
        }
    } else {
        // Mode Création
        const newProduct = {
            id: 'PROD_' + Date.now(),
            name,
            category,
            buyPrice,
            sellPrice,
            quantity,
            minStock,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        showToast(`Produit "${name}" ajouté au stock !`, "success");
    }

    saveProducts();
    closeProductModal();
    renderProductsTable();
    renderDashboard();
});

/**
 * Supprime un produit avec confirmation
 */
function deleteProduct(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const confirmDelete = confirm(`Voulez-vous vraiment supprimer le produit "${prod.name}" du stock ?`);
    if (confirmDelete) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        showToast(`Produit "${prod.name}" supprimé.`, "warning");
        renderProductsTable();
        renderDashboard();
    }
}


// ==========================================
// 7. MODAL DE RÉAPPROVISIONNEMENT RAPIDE
// ==========================================

function openRestockModal(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('restock-product-id').value = prod.id;
    document.getElementById('restock-product-name').textContent = `${prod.name} (Stock actuel : ${prod.quantity})`;
    document.getElementById('restock-qty').value = "5";
    document.getElementById('restock-modal').classList.add('show');
}

function closeRestockModal() {
    document.getElementById('restock-modal').classList.remove('show');
}

document.getElementById('restock-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('restock-product-id').value;
    const addQty = parseInt(document.getElementById('restock-qty').value, 10);

    if (isNaN(addQty) || addQty <= 0) {
        showToast("Veuillez saisir une quantité valide à ajouter.", "error");
        return;
    }

    const prod = products.find(p => p.id === id);
    if (prod) {
        prod.quantity = Number(prod.quantity) + addQty;
        saveProducts();
        showToast(`Stock de "${prod.name}" mis à jour : +${addQty} (Nouveau stock : ${prod.quantity})`, "success");
        closeRestockModal();
        renderProductsTable();
        renderDashboard();
    }
});


// ==========================================
// 8. FORMULAIRE D'ENREGISTREMENT DE VENTE
// ==========================================

function initSaleForm() {
    const select = document.getElementById('sale-product-select');
    select.innerHTML = '<option value="">-- Choisir un produit en stock --</option>';

    // Trier les produits par nom
    const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name));

    sorted.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        const isOutOfStock = Number(p.quantity) <= 0;
        option.textContent = `${p.name} [Stock: ${p.quantity}] - ${formatFCFA(p.sellPrice)}`;
        if (isOutOfStock) {
            option.textContent += ' (ÉPUISÉ)';
            option.disabled = true;
        }
        select.appendChild(option);
    });

    // Réinitialise les champs de vente
    document.getElementById('sale-quantity').value = 1;
    document.getElementById('sale-custom-price').value = "";
    document.getElementById('sale-product-preview').classList.add('hidden');
    updateSaleCalculation();
}

// Changement de produit sélectionné
document.getElementById('sale-product-select').addEventListener('change', function() {
    const productId = this.value;
    const previewBox = document.getElementById('sale-product-preview');

    if (!productId) {
        previewBox.classList.add('hidden');
        document.getElementById('sale-custom-price').value = "";
        updateSaleCalculation();
        return;
    }

    const prod = products.find(p => p.id === productId);
    if (prod) {
        previewBox.classList.remove('hidden');
        document.getElementById('preview-category').textContent = prod.category;
        document.getElementById('preview-stock').textContent = `${prod.quantity} disponible(s)`;
        document.getElementById('preview-unit-price').textContent = formatFCFA(prod.sellPrice);

        const margin = Number(prod.sellPrice) - Number(prod.buyPrice);
        document.getElementById('preview-unit-profit').textContent = `+${formatFCFA(margin)}`;

        // Remplir le prix de vente par défaut
        document.getElementById('sale-custom-price').value = prod.sellPrice;
        document.getElementById('sale-quantity').max = prod.quantity;
        document.getElementById('sale-quantity').value = 1;

        updateSaleCalculation();
    }
});

// Boutons + et - pour la quantité
document.getElementById('qty-minus').addEventListener('click', () => {
    const input = document.getElementById('sale-quantity');
    const val = parseInt(input.value, 10) || 1;
    if (val > 1) {
        input.value = val - 1;
        updateSaleCalculation();
    }
});

document.getElementById('qty-plus').addEventListener('click', () => {
    const input = document.getElementById('sale-quantity');
    const val = parseInt(input.value, 10) || 1;
    const productId = document.getElementById('sale-product-select').value;
    const prod = products.find(p => p.id === productId);

    if (prod && val >= prod.quantity) {
        showToast(`Stock maximum disponible atteint (${prod.quantity}).`, "warning");
        return;
    }
    input.value = val + 1;
    updateSaleCalculation();
});

document.getElementById('sale-quantity').addEventListener('input', updateSaleCalculation);
document.getElementById('sale-custom-price').addEventListener('input', updateSaleCalculation);

/**
 * Calcule en temps réel le total et le bénéfice attendu pour la vente
 */
function updateSaleCalculation() {
    const productId = document.getElementById('sale-product-select').value;
    const qty = parseInt(document.getElementById('sale-quantity').value, 10) || 0;
    const customPrice = parseFloat(document.getElementById('sale-custom-price').value) || 0;

    const totalEl = document.getElementById('summary-total-price');
    const profitEl = document.getElementById('summary-total-profit');

    if (!productId || qty <= 0) {
        totalEl.textContent = "0 FCFA";
        profitEl.textContent = "0 FCFA";
        return;
    }

    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const totalSale = qty * customPrice;
    const totalProfit = qty * (customPrice - Number(prod.buyPrice));

    totalEl.textContent = formatFCFA(totalSale);
    profitEl.textContent = formatFCFA(totalProfit);
}

// Validation de la vente
document.getElementById('sale-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const productId = document.getElementById('sale-product-select').value;
    const qty = parseInt(document.getElementById('sale-quantity').value, 10);
    const unitSellPrice = parseFloat(document.getElementById('sale-custom-price').value);

    if (!productId) {
        showToast("Veuillez sélectionner un produit.", "error");
        return;
    }

    const prod = products.find(p => p.id === productId);
    if (!prod) {
        showToast("Produit introuvable.", "error");
        return;
    }

    if (isNaN(qty) || qty <= 0) {
        showToast("La quantité doit être au moins de 1.", "error");
        return;
    }

    // VÉRIFICATION DU STOCK DISPONIBLE (Règle essentielle)
    if (qty > Number(prod.quantity)) {
        showToast(`Stock insuffisant ! Il ne reste que ${prod.quantity} unité(s) en stock.`, "error");
        return;
    }

    const unitBuyPrice = Number(prod.buyPrice);
    const totalSale = qty * unitSellPrice;
    const totalProfit = qty * (unitSellPrice - unitBuyPrice);
    const saleDate = new Date().toISOString();

    // 1. Décrémentation automatique du stock
    prod.quantity = Number(prod.quantity) - qty;

    // 2. Création de l'enregistrement de vente
    const newSale = {
        id: 'SALE_' + Date.now(),
        date: saleDate,
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        unitBuyPrice: unitBuyPrice,
        unitSellPrice: unitSellPrice,
        quantity: qty,
        totalSale: totalSale,
        totalProfit: totalProfit
    };

    sales.push(newSale);

    // 3. Sauvegarde dans le localStorage
    saveProducts();
    saveSales();

    // 4. Notification et ticket de caisse
    showToast(`Vente enregistrée avec succès ! (-${qty} en stock)`, "success");
    openReceiptModal(newSale);

    // 5. Réinitialisation du formulaire
    initSaleForm();
    renderDashboard();
});


// ==========================================
// 9. REÇU / TICKET DE VENTE
// ==========================================

function openReceiptModal(sale) {
    document.getElementById('receipt-date').textContent = formatDateTime(sale.date);
    document.getElementById('receipt-item-name').textContent = sale.productName;
    document.getElementById('receipt-unit-price').textContent = formatFCFA(sale.unitSellPrice);
    document.getElementById('receipt-qty').textContent = `${sale.quantity}x`;
    document.getElementById('receipt-total-amount').textContent = formatFCFA(sale.totalSale);

    document.getElementById('receipt-modal').classList.add('show');
}

function closeReceiptModal() {
    document.getElementById('receipt-modal').classList.remove('show');
}

function printReceipt() {
    window.print();
}


// ==========================================
// 10. HISTORIQUE DES VENTES & CALCULS GLOBAUX
// ==========================================

function renderSalesHistory() {
    const tbody = document.getElementById('history-tbody');
    const emptyState = document.getElementById('history-empty');
    const searchTerm = (document.getElementById('history-search').value || '').toLowerCase().trim();
    const periodFilter = document.getElementById('history-filter-period').value;

    const now = new Date();

    // Filtrer les ventes
    let filtered = sales.filter(sale => {
        const matchSearch = sale.productName.toLowerCase().includes(searchTerm) ||
                            (sale.category && sale.category.toLowerCase().includes(searchTerm));

        let matchPeriod = true;
        const saleDate = new Date(sale.date);

        if (periodFilter === 'TODAY') {
            matchPeriod = isToday(sale.date);
        } else if (periodFilter === 'WEEK') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            matchPeriod = saleDate >= sevenDaysAgo;
        } else if (periodFilter === 'MONTH') {
            matchPeriod = saleDate.getMonth() === now.getMonth() &&
                          saleDate.getFullYear() === now.getFullYear();
        }

        return matchSearch && matchPeriod;
    });

    // Inverser pour avoir les plus récentes en premier
    filtered = [...filtered].reverse();

    // Mettre à jour les totaux filtrés
    const totalCount = filtered.length;
    const totalCA = filtered.reduce((sum, s) => sum + (s.totalSale || 0), 0);
    const totalProfit = filtered.reduce((sum, s) => sum + (s.totalProfit || 0), 0);

    document.getElementById('history-count').textContent = totalCount;
    document.getElementById('history-total-ca').textContent = formatFCFA(totalCA);
    document.getElementById('history-total-profit').textContent = formatFCFA(totalProfit);

    if (sales.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted" style="padding: 2rem;">
                    Aucune vente ne correspond à ces filtres.
                </td>
            </tr>
        `;
        emptyState.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = filtered.map(sale => `
        <tr>
            <td>
                <strong>${formatDateTime(sale.date)}</strong>
            </td>
            <td><strong>${escapeHtml(sale.productName)}</strong></td>
            <td><span class="badge badge-neutral">${escapeHtml(sale.category || 'Accessoires')}</span></td>
            <td>${formatFCFA(sale.unitSellPrice)}</td>
            <td><span class="badge badge-neutral">${sale.quantity}</span></td>
            <td><strong class="text-blue">${formatFCFA(sale.totalSale)}</strong></td>
            <td><span class="font-bold text-emerald">+${formatFCFA(sale.totalProfit)}</span></td>
            <td class="text-right">
                <button class="action-btn delete-btn" title="Annuler cette vente (restaure le stock)" onclick="cancelSale('${sale.id}')">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Filtres de recherche dans l'historique
document.getElementById('history-search').addEventListener('input', renderSalesHistory);
document.getElementById('history-filter-period').addEventListener('change', renderSalesHistory);

/**
 * Annuler une vente : supprime la vente et réinjecte la quantité dans le stock
 */
function cancelSale(saleId) {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    const confirmCancel = confirm(`Voulez-vous vraiment annuler la vente de ${sale.quantity}x "${sale.productName}" ? Le stock sera automatiquement restauré.`);
    if (!confirmCancel) return;

    // Restaurer le stock du produit si celui-ci existe toujours
    const prod = products.find(p => p.id === sale.productId);
    if (prod) {
        prod.quantity = Number(prod.quantity) + Number(sale.quantity);
        saveProducts();
    }

    // Supprimer la transaction de la liste des ventes
    sales = sales.filter(s => s.id !== saleId);
    saveSales();

    showToast(`Vente annulée. ${sale.quantity} unité(s) restaurée(s) au stock.`, "warning");
    renderSalesHistory();
    renderDashboard();
}


// ==========================================
// 11. EXPORTATION DES VENTES VERS EXCEL (CSV)
// ==========================================

function exportSalesToCSV() {
    if (sales.length === 0) {
        showToast("Aucune vente à exporter.", "warning");
        return;
    }

    // En-têtes CSV
    const headers = ["ID Vente", "Date et Heure", "Nom du Produit", "Categorie", "Quantite", "Prix Unitaire Vente (FCFA)", "Total Vente (FCFA)", "Benefice Brut (FCFA)"];

    const rows = sales.map(s => [
        s.id,
        `"${formatDateTime(s.date)}"`,
        `"${s.productName.replace(/"/g, '""')}"`,
        `"${(s.category || '').replace(/"/g, '""')}"`,
        s.quantity,
        s.unitSellPrice,
        s.totalSale,
        s.totalProfit
    ]);

    // Assemblage avec point-virgule (standard Excel pour les pays francophones)
    let csvContent = "\uFEFF"; // BOM UTF-8 pour les accents
    csvContent += headers.join(";") + "\r\n";
    rows.forEach(row => {
        csvContent += row.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const dateFormatted = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `StockFacile_Ventes_${dateFormatted}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exportation CSV terminée !", "success");
}

document.getElementById('btn-export-csv').addEventListener('click', exportSalesToCSV);


// ==========================================
// 12. SÉCURITÉ : ÉCHAPPEMENT HTML
// ==========================================

function escapeHtml(text) {
    if (!text) return "";
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}


// ==========================================
// 13. FERMETURE DES MODALES (CLIC EXTÉRIEUR ET ÉCHAP)
// ==========================================

document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.show').forEach(m => m.classList.remove('show'));
    }
});


// ==========================================
// 14. INITIALISATION AU CHARGEMENT DE LA PAGE
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderDashboard();
    renderProductsTable();
});
