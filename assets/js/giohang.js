// =========================================================
// MAISON MODE - XU LY GIO HANG (VANILLA JS)
// =========================================================

const CART_STORAGE_KEY = "maison_cart";
const FREE_SHIP_THRESHOLD = 1000000;
const SHIPPING_FEE = 30000;

// Ma giam gia mau
const COUPON_LIST = {
    MAISON10: 0.1,  // Giam 10%
    SALE50K: 50000  // Giam 50.000d
};

let cartItems = [];
let appliedCoupon = null;

function formatVND(amount) {
    const safeNumber = Number(amount) || 0;
    return safeNumber.toLocaleString("vi-VN") + "đ";
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        cartItems = Array.isArray(parsed)
            ? parsed.map((item, idx) => ({
                  id: item.id || `item-${idx}`,
                  name: item.name || "Sản phẩm Maison Mode",
                  price: Number(item.price) || 0,
                  image: item.image || "",
                  color: item.color || "Mặc định",
                  size: item.size || "M",
                  quantity: Math.max(1, Number(item.quantity) || 1),
                  checked: item.checked !== undefined ? Boolean(item.checked) : true
              }))
            : [];
    } catch (err) {
        cartItems = [];
    }
}

function saveCartToStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

// function updateHeaderBadge() {
//     const badge = document.querySelector(".cart-badge");
//     if (!badge) return;

//     let totalQty = 0;
//     for (let i = 0; i < cartItems.length; i++) {
//         totalQty += cartItems[i].quantity;
//     }
//     badge.textContent = String(totalQty);
// }

function createCartRow(item, index) {
    const article = document.createElement("article");
    article.className = "cart-item";
    article.dataset.index = String(index);

    // 1. Checkbox chon mua
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-check";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", () => {
        cartItems[index].checked = checkbox.checked;
        saveCartToStorage();
        renderSummary();
        syncSelectAllCheckbox();
    });
    article.appendChild(checkbox);

    // 2. Anh san pham
    const thumbLink = document.createElement("div");
    thumbLink.className = "item-thumb";

    if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.loading = "lazy";
        thumbLink.appendChild(img);
    }
    article.appendChild(thumbLink);

    // 3. Thong tin ten, mau, size, don gia
    const details = document.createElement("div");
    details.className = "item-details";

    const titleEl = document.createElement("h2");
    titleEl.className = "item-name";
    titleEl.textContent = item.name;
    details.appendChild(titleEl);

    const variants = document.createElement("div");
    variants.className = "item-variants";

    const colorSpan = document.createElement("span");
    colorSpan.textContent = "Màu: ";
    const colorBold = document.createElement("b");
    colorBold.textContent = item.color;
    colorSpan.appendChild(colorBold);
    variants.appendChild(colorSpan);

    const sizeLabel = document.createElement("label");
    sizeLabel.textContent = "Size: ";
    const sizeSelect = document.createElement("select");
    sizeSelect.className = "item-size-select";

    const sizes = ["S", "M", "L", "XL"];
    sizes.forEach((sz) => {
        const opt = document.createElement("option");
        opt.value = sz;
        opt.textContent = sz;
        if (item.size === sz) opt.selected = true;
        sizeSelect.appendChild(opt);
    });

    sizeSelect.addEventListener("change", () => {
        cartItems[index].size = sizeSelect.value;
        saveCartToStorage();
    });

    sizeLabel.appendChild(sizeSelect);
    variants.appendChild(sizeLabel);
    details.appendChild(variants);

    const unitPriceEl = document.createElement("p");
    unitPriceEl.className = "item-unit-price";
    unitPriceEl.textContent = formatVND(item.price);
    details.appendChild(unitPriceEl);

    article.appendChild(details);

    const side = document.createElement("div");
    side.className = "item-side";

    const qtyControl = document.createElement("div");
    qtyControl.className = "qty-control";

    const btnMinus = document.createElement("button");
    btnMinus.type = "button";
    btnMinus.className = "qty-btn btn-minus";
    btnMinus.textContent = "-";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.className = "qty-input";
    qtyInput.min = "1";
    qtyInput.max = "20";
    qtyInput.value = String(item.quantity);

    const btnPlus = document.createElement("button");
    btnPlus.type = "button";
    btnPlus.className = "qty-btn btn-plus";
    btnPlus.textContent = "+";

    const subtotalEl = document.createElement("div");
    subtotalEl.className = "item-subtotal";
    subtotalEl.textContent = formatVND(item.price * item.quantity);

    const updateQty = (newQty) => {
        const validQty = Math.max(1, Math.min(20, Number(newQty) || 1));
        cartItems[index].quantity = validQty;
        qtyInput.value = String(validQty);
        subtotalEl.textContent = formatVND(cartItems[index].price * validQty);
        saveCartToStorage();
        renderSummary();
    };

    btnMinus.addEventListener("click", () => updateQty(cartItems[index].quantity - 1));
    btnPlus.addEventListener("click", () => updateQty(cartItems[index].quantity + 1));
    qtyInput.addEventListener("change", () => updateQty(qtyInput.value));

    qtyControl.appendChild(btnMinus);
    qtyControl.appendChild(qtyInput);
    qtyControl.appendChild(btnPlus);
    side.appendChild(qtyControl);
    side.appendChild(subtotalEl);

    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "btn-remove-item";
    btnRemove.title = "Xóa sản phẩm";

    const removeIcon = document.createElement("i");
    removeIcon.className = "fa-solid fa-xmark";
    btnRemove.appendChild(removeIcon);

    btnRemove.addEventListener("click", () => {
        cartItems.splice(index, 1);
        saveCartToStorage();
        renderCart();
    });

    side.appendChild(btnRemove);
    article.appendChild(side);

    return article;
}

function renderCart() {
    const listContainer = document.getElementById("cart-list");
    const emptyBox = document.getElementById("cart-empty");
    const layoutBox = document.getElementById("cart-layout");

    if (!listContainer) return;
    listContainer.textContent = "";

    if (cartItems.length === 0) {
        if (emptyBox) emptyBox.style.display = "block";
        if (layoutBox) layoutBox.style.display = "none";
        capNhatIconGioHang();
        renderSummary();
        return;
    }

    if (emptyBox) emptyBox.style.display = "none";
    if (layoutBox) layoutBox.style.display = "";

    cartItems.forEach((item, idx) => {
        const row = createCartRow(item, idx);
        listContainer.appendChild(row);
    });

    syncSelectAllCheckbox();
    capNhatIconGioHang();
    renderSummary();
}
function syncSelectAllCheckbox() {
    const selectAll = document.getElementById("select-all");
    const selectedCountEl = document.getElementById("total-selected");

    const checkedItems = cartItems.filter((item) => item.checked);
    if (selectedCountEl) {
        selectedCountEl.textContent = String(checkedItems.length);
    }
    if (selectAll) {
        selectAll.checked = cartItems.length > 0 && checkedItems.length === cartItems.length;
    }
}

function renderSummary() {
    const subtotalEl = document.getElementById("subtotal-price");
    const discountEl = document.getElementById("discount-price");
    const shippingEl = document.getElementById("shipping-price");
    const finalTotalEl = document.getElementById("final-total");

    let subtotal = 0;
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].checked) {
            subtotal += cartItems[i].price * cartItems[i].quantity;
        }
    }

    let discount = 0;
    if (subtotal > 0 && appliedCoupon) {
        const rule = COUPON_LIST[appliedCoupon];
        if (typeof rule === "number") {
            discount = rule < 1 ? Math.round(subtotal * rule) : Math.min(rule, subtotal);
        }
    }

    const afterDiscount = Math.max(0, subtotal - discount);
    const shippingFee = afterDiscount === 0 || afterDiscount >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
    const finalTotal = afterDiscount + shippingFee;

    if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
    if (discountEl) discountEl.textContent = "-" + formatVND(discount);
    if (shippingEl) shippingEl.textContent = formatVND(shippingFee);
    if (finalTotalEl) finalTotalEl.textContent = formatVND(finalTotal);
}

function bindEvents() {
    const selectAll = document.getElementById("select-all");
    if (selectAll) {
        selectAll.addEventListener("change", () => {
            cartItems.forEach((item) => {
                item.checked = selectAll.checked;
            });
            saveCartToStorage();
            renderCart();
        });
    }

    const btnClear = document.getElementById("btn-clear-cart");
    if (btnClear) {
        btnClear.addEventListener("click", () => {
            if (cartItems.length === 0) return;
            cartItems = [];
            appliedCoupon = null;
            saveCartToStorage();
            renderCart();
        });
    }

    const btnCoupon = document.getElementById("btn-apply-coupon");
    const couponInput = document.getElementById("coupon-input");
    if (btnCoupon && couponInput) {
        btnCoupon.addEventListener("click", () => {
            const code = couponInput.value.trim().toUpperCase();
            if (!code) {
                alert("Vui lòng nhập mã giảm giá.");
                return;
            }
            if (!COUPON_LIST[code]) {
                appliedCoupon = null;
                renderSummary();
                alert("Mã giảm giá không hợp lệ (thử MAISON10 hoặc SALE50K).");
                return;
            }
            appliedCoupon = code;
            renderSummary();
            alert(`Đã áp dụng mã ${code}.`);
        });
    }

    const btnCheckout = document.getElementById("btn-checkout");
    if (btnCheckout) {
        btnCheckout.addEventListener("click", () => {
            const selected = cartItems.filter((item) => item.checked);
            if (selected.length === 0) {
                alert("Bạn chưa chọn sản phẩm nào để thanh toán.");
                return;
            }
            window.location.href = "thanhtoan.html";
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    bindEvents();
    renderCart();
});