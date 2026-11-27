// =========================================================
// MAISON MODE - XU LY THANH TOAN DON HANG (VANILLA JS)
// =========================================================

const CART_STORAGE_KEY = layKeyGioHang();
const COUPON_KEY = layKeyGioHang() + "_coupon";
const ORDER_STORAGE_KEY = "maison_orders";
const FREE_SHIP_THRESHOLD = 1000000;
const SHIPPING_FEE = 30000;

let allCartItems = [];
let selectedItems = [];

function formatVND(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + "đ";
}

function loadSelectedCartItems() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        allCartItems = Array.isArray(parsed) ? parsed : [];
        selectedItems = allCartItems.filter((item) => item.checked !== false);
    } catch (err) {
        allCartItems = [];
        selectedItems = [];
    }
}

function calcDiscount(subtotal) {
    let coupon = null;
    try {
        coupon = JSON.parse(localStorage.getItem(COUPON_KEY));
    } catch (err) {
        coupon = null;
    }
    if (!coupon || !(coupon.value > 0) || subtotal <= 0) return 0;
    if (coupon.value < 1) return Math.round(subtotal * coupon.value);
    return Math.min(coupon.value, subtotal);
}
function calcShipping(afterDiscount) {
    return afterDiscount > 0 && afterDiscount < FREE_SHIP_THRESHOLD ? SHIPPING_FEE : 0;
}

function createOrderItemRow(item) {
    const row = document.createElement("div");
    row.className = "order-item-row";

    const thumb = document.createElement("div");
    thumb.className = "order-item-thumb";
    if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name || "Sản phẩm";
        thumb.appendChild(img);
    }
    row.appendChild(thumb);

    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "order-item-title";
    title.textContent = item.name || "Sản phẩm Maison Mode";

    const meta = document.createElement("div");
    meta.className = "order-item-meta";
    const colorText = item.color ? item.color : "Mặc định";
    const sizeText = item.size ? item.size : "M";
    const qty = Math.max(1, Number(item.quantity) || 1);
    meta.textContent = `Màu: ${colorText} | Size: ${sizeText} | SL: ${qty}`;

    info.appendChild(title);
    info.appendChild(meta);
    row.appendChild(info);

    const priceEl = document.createElement("div");
    priceEl.className = "order-item-price";
    const lineTotal = (Number(item.price) || 0) * qty;
    priceEl.textContent = formatVND(lineTotal);
    row.appendChild(priceEl);

    return row;
}

function renderCheckoutSummary() {
    const emptyBox = document.getElementById("checkout-empty");
    const formEl = document.getElementById("checkout-form");
    const listEl = document.getElementById("order-items-list");
    const countEl = document.getElementById("order-item-count");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");

    capNhatIconGioHang();

    if (selectedItems.length === 0) {
        if (emptyBox) emptyBox.style.display = "block";
        if (formEl) formEl.style.display = "none";
        return;
    }

    if (emptyBox) emptyBox.style.display = "none";
    if (formEl) formEl.style.display = "";

    if (listEl) {
        listEl.textContent = "";
        let subtotal = 0;
        let totalQty = 0;

        selectedItems.forEach((item) => {
            const qty = Math.max(1, Number(item.quantity) || 1);
            const price = Number(item.price) || 0;
            subtotal += price * qty;
            totalQty += qty;
            listEl.appendChild(createOrderItemRow(item));
        });

        const discount = calcDiscount(subtotal);
        const afterDiscount = subtotal - discount;
        const shippingFee = calcShipping(afterDiscount);
        const finalTotal = afterDiscount + shippingFee;
        if (countEl) countEl.textContent = String(totalQty);
        if (subtotalEl) subtotalEl.textContent = formatVND(subtotal);
        if (discountEl) discountEl.textContent = "-" + formatVND(discount);
        if (shippingEl) shippingEl.textContent = formatVND(shippingFee);
        if (totalEl) totalEl.textContent = formatVND(finalTotal);
    }
}

function saveCompletedOrder(orderData) {
    try {
        const raw = localStorage.getItem(ORDER_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const orders = Array.isArray(list) ? list : [];
        orders.unshift(orderData);
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
        // Bỏ qua nếu trình duyệt chặn lưu trữ
    }
}
function baoLoi(input, idLoi, thongBao) {
    const oLoi = document.getElementById(idLoi);
    if (oLoi) oLoi.textContent = thongBao;
    if (input) input.classList.add("input-error");
}

function xoaLoi(input, idLoi) {
    const oLoi = document.getElementById(idLoi);
    if (oLoi) oLoi.textContent = "";
    if (input) input.classList.remove("input-error");
}
function bindCheckoutForm() {
    const formEl = document.getElementById("checkout-form");
    const errorEl = document.getElementById("form-error");
    const successBox = document.getElementById("order-success-box");
    const codeEl = document.getElementById("success-order-code");

    if (!formEl) return;
    const phoneInputEl = document.getElementById("customer-phone");
    const emailInputEl = document.getElementById("customer-email");
    if (phoneInputEl) phoneInputEl.addEventListener("input", () => xoaLoi(phoneInputEl, "phone-error"));
    if (emailInputEl) emailInputEl.addEventListener("input", () => xoaLoi(emailInputEl, "email-error"));
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("customer-name");
        const phoneInput = document.getElementById("customer-phone");
        const emailInput = document.getElementById("customer-email");
        const cityInput = document.getElementById("customer-city");
        const districtInput = document.getElementById("customer-district");
        const addressInput = document.getElementById("customer-address");
        const noteInput = document.getElementById("order-note");
        const paymentRadio = formEl.querySelector('input[name="payment"]:checked');

        const name = nameInput ? nameInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const city = cityInput ? cityInput.value.trim() : "";
        const district = districtInput ? districtInput.value.trim() : "";
        const address = addressInput ? addressInput.value.trim() : "";
        const note = noteInput ? noteInput.value.trim() : "";
        const paymentMethod = paymentRadio ? paymentRadio.value : "cod";

        xoaLoi(phoneInput, "phone-error");
        xoaLoi(emailInput, "email-error");
        if (!name || !phone || !city || !district || !address) {
            if (errorEl) {
                errorEl.textContent = "Vui lòng điền đầy đủ các trường có dấu (*).";
            }
            return;
        }
        const phoneClean = phone.replace(/\s+/g, "");
        if (!/^0\d{9}$/.test(phoneClean)) {
            if (errorEl) {
                errorEl.textContent = "Số điện thoại chưa hợp lệ.";
            }
            baoLoi(phoneInput, "phone-error", "Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0 (ví dụ: 0912345678).");
            phoneInput.focus();
            return;
        }
        if (email && !/^[a-z0-9](\.?[a-z0-9]){5,29}@gmail\.com$/.test(email.toLowerCase())) {
            if (errorEl) {
                errorEl.textContent = "Email chưa hợp lệ.";
            }
            baoLoi(emailInput, "email-error", "Email phải là địa chỉ hợp lệ (ví dụ: nguyenminhanh@gmail.com).");
            emailInput.focus();
            return;
        }

        if (errorEl) {
            errorEl.textContent = "";
        }

        let subtotal = 0;
        selectedItems.forEach((item) => {
            const qty = Math.max(1, Number(item.quantity) || 1);
            subtotal += (Number(item.price) || 0) * qty;
        });
        const discount = calcDiscount(subtotal);
        const shippingFee = calcShipping(subtotal - discount);
        const totalAmount = subtotal - discount + shippingFee;
        const orderCode = "MM-" + String(Date.now()).slice(-6);

        saveCompletedOrder({
            code: orderCode,
            createdAt: new Date().toISOString(),
            customer: { name, phone: phoneClean, email, city, district, address, note },
            paymentMethod,
            items: selectedItems,
            discount,
            shippingFee,
            totalAmount
        });
        localStorage.removeItem(COUPON_KEY);
        allCartItems = allCartItems.filter((item) => item.checked === false);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(allCartItems));
        capNhatIconGioHang();

        formEl.style.display = "none";
        if (codeEl) codeEl.textContent = orderCode;
        if (successBox) successBox.style.display = "block";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadSelectedCartItems();
    renderCheckoutSummary();
    bindCheckoutForm();
});