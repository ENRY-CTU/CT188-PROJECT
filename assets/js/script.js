/* ==========================================================
   MAISON MODE - TRANG DANH SÁCH SẢN PHẨM
   Các thẻ sản phẩm viết sẵn trong sanpham.html (Cách 1).
   File này xử lý: lọc, tìm kiếm, sắp xếp, chọn size/màu,
   giỏ hàng, yêu thích, thông báo, nút về đầu trang.
   ========================================================== */

var CART_KEY = "maison_cart";      // key giỏ hàng trong localStorage
var WISH_KEY = "mm_wishlist";  // key danh sách yêu thích
var MAX_QTY = 20;              // số lượng tối đa của 1 dòng trong giỏ

// Lưu lại các lựa chọn lọc hiện tại
var state = { category: "all", price: "all", sort: "default", keyword: "" };

/* ---------- Hàm phụ ---------- */

// Tính % giảm giá của 1 sản phẩm
function getDiscount(card) {
    var price = Number(card.getAttribute("data-price"));
    var oldPrice = Number(card.getAttribute("data-oldprice"));
    if (oldPrice > price) {
        return Math.round((1 - price / oldPrice) * 100);
    }
    return 0;
}

/* ---------- Lọc và sắp xếp ---------- */

// Xem 1 sản phẩm có hợp với bộ lọc hiện tại không
function isMatch(card) {
    // danh mục: so với data-cat hoặc các nhãn new / hot / sale
    var tags = card.getAttribute("data-tags").split(" ");
    var okCat = state.category === "all" ||
                card.getAttribute("data-cat") === state.category ||
                tags.indexOf(state.category) !== -1;

    // khoảng giá, ví dụ "0-500000"
    var okPrice = true;
    if (state.price !== "all") {
        var range = state.price.split("-");
        var price = Number(card.getAttribute("data-price"));
        okPrice = price >= Number(range[0]) && price <= Number(range[1]);
    }

    // từ khóa: tìm trong tên và tên danh mục
    var okKey = true;
    if (state.keyword !== "") {
        var text = card.querySelector(".product-title").textContent + " " +
                   card.querySelector(".product-cat").textContent;
        okKey = text.toLowerCase().indexOf(state.keyword.toLowerCase()) !== -1;
    }

    return okCat && okPrice && okKey;
}

// Sắp xếp lại vị trí các thẻ trong lưới
function sortCards() {
    var grid = document.getElementById("product-grid");
    var cards = Array.from(grid.querySelectorAll(".product-card"));

    cards.sort(function (a, b) {
        var priceA = Number(a.getAttribute("data-price"));
        var priceB = Number(b.getAttribute("data-price"));
        var nameA = a.querySelector(".product-title").textContent;
        var nameB = b.querySelector(".product-title").textContent;

        if (state.sort === "price-asc") return priceA - priceB;
        if (state.sort === "price-desc") return priceB - priceA;
        if (state.sort === "name-asc") return nameA.localeCompare(nameB, "vi");
        if (state.sort === "discount") return getDiscount(b) - getDiscount(a);
        // mặc định: theo thứ tự ban đầu trong HTML
        return Number(a.getAttribute("data-index")) - Number(b.getAttribute("data-index"));
    });

    // đưa từng thẻ về trước khối "không có kết quả" theo thứ tự mới
    var emptyBox = document.getElementById("empty-state");
    cards.forEach(function (card) {
        grid.insertBefore(card, emptyBox);
    });
}

// Lọc + sắp xếp rồi cập nhật số lượng kết quả
function applyFilters() {
    sortCards();

    var cards = document.querySelectorAll("#product-grid .product-card");
    var shown = 0;
    cards.forEach(function (card) {
        if (isMatch(card)) {
            card.style.display = "";
            shown++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("shown-count").textContent = shown;
    document.getElementById("total-count").textContent = cards.length;

    // dòng "cho từ khóa ..." chỉ hiện khi đang tìm kiếm
    var keywordText = document.getElementById("keyword-text");
    if (state.keyword !== "") {
        document.getElementById("keyword-show").textContent = state.keyword;
        keywordText.style.display = "";
    } else {
        keywordText.style.display = "none";
    }

    // không có sản phẩm nào thì hiện thông báo
    document.getElementById("empty-state").style.display = (shown === 0) ? "" : "none";
}

/* ---------- Giỏ hàng ---------- */
// Giỏ hàng lưu dạng mảng: [{ id, size, color, qty }, ...]

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
    var total = 0;
    getCart().forEach(function (item) {
        total += item.quantity;
    });
    document.querySelectorAll(".cart-badge").forEach(function (badge) {
        badge.textContent = total;
    });
}

// Thêm sản phẩm vào giỏ, thành công thì trả về true
function addToCart(card) {
    var id = card.getAttribute("data-id");
    var name = card.querySelector(".product-title").textContent;
    var qty = parseInt(card.querySelector(".quantity-input").value, 10);
    var priceText = card.querySelector(".price-new").textContent;
    var price = parseInt(priceText.replace(/\D/g, ""), 10);
    var image = card.querySelector(".product-thumb img").getAttribute("src");
    if (isNaN(qty) || qty <= 0) {
        showToast("Số lượng không hợp lệ, vui lòng nhập lại!", "error");
        return false;
    }
    if (qty > MAX_QTY) qty = MAX_QTY;

    var size = card.querySelector(".size-btn.selected").getAttribute("data-size");
    var color = card.querySelector(".color-dot.selected").getAttribute("data-color");

    // nếu đã có cùng sản phẩm + size + màu thì cộng thêm số lượng
    var cart = getCart();
    var found = cart.find(function (item) {
        return item.id === id && item.size === size && item.color === color;
    });
    if (found) {
        found.quantity = Math.min(found.quantity + qty, MAX_QTY);
    } else {
        cart.push({ id: id, name: name, price: price, image: image, color: color, size: size, quantity: qty, checked: true });
    }

    saveCart(cart);
    updateCartBadge();
    showToast("Đã thêm \"" + name + "\" (" + color + ", " + size + ") vào giỏ hàng!");
    return true;
}

/* ---------- Yêu thích ---------- */

function getWishlist() {
    return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
}

// Khi mở trang, tô đỏ những sản phẩm đã yêu thích trước đó
function loadWishlist() {
    var wishes = getWishlist();
    document.querySelectorAll(".product-card").forEach(function (card) {
        if (wishes.indexOf(card.getAttribute("data-id")) !== -1) {
            card.querySelector(".btn-wish").classList.add("active");
            card.querySelector(".btn-wish i").className = "fa-solid fa-heart";
        }
    });
}

function toggleWish(id, btn) {
    var list = getWishlist();
    var index = list.indexOf(id);
    var icon = btn.querySelector("i");

    if (index === -1) {
        list.push(id);
        btn.classList.add("active");
        icon.className = "fa-solid fa-heart";
        showToast("Đã thêm vào danh sách yêu thích!");
    } else {
        list.splice(index, 1);
        btn.classList.remove("active");
        icon.className = "fa-regular fa-heart";
    }
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
}

/* ---------- Thông báo (toast) ---------- */

function showToast(message, type) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "toast-wrap";
        document.body.appendChild(wrap);
    }

    var toast = document.createElement("div");
    toast.className = "toast";
    if (type === "error") toast.classList.add("error");

    var icon = document.createElement("i");
    icon.className = (type === "error") ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";

    var text = document.createElement("span");
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    wrap.appendChild(toast);

    // sau 2,8 giây thì mờ dần rồi xóa
    setTimeout(function () {
        toast.classList.add("hide");
        setTimeout(function () {
            toast.remove();
        }, 350);
    }, 2800);
}

/* ---------- Sự kiện ---------- */

// Đưa tất cả bộ lọc về mặc định
function resetFilters() {
    state.category = "all";
    state.price = "all";
    state.sort = "default";
    state.keyword = "";

    document.querySelectorAll("#category-menu .link").forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("data-category") === "all");
    });
    document.querySelector("input[name='price'][value='all']").checked = true;
    document.getElementById("sort-select").value = "default";
    document.getElementById("search-input").value = "";
    applyFilters();
}

function bindEvents() {
    // lọc theo danh mục
    var links = document.querySelectorAll("#category-menu .link");
    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            links.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
            state.category = link.getAttribute("data-category");
            applyFilters();
        });
    });

    // lọc theo giá
    document.querySelectorAll("input[name='price']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            state.price = radio.value;
            applyFilters();
        });
    });

    // sắp xếp
    document.getElementById("sort-select").addEventListener("change", function () {
        state.sort = this.value;
        applyFilters();
    });

    // ô tìm kiếm: để trống thì không cho gửi
    document.getElementById("search-form").addEventListener("submit", function (e) {
        var input = document.getElementById("search-input");
        if (input.value.trim() === "") {
            e.preventDefault();
            showToast("Vui lòng nhập từ khóa tìm kiếm!", "error");
            input.focus();
        }
    });

    // nút "Xóa bộ lọc"
    document.getElementById("btn-reset").addEventListener("click", resetFilters);

    // các nút bên trong thẻ sản phẩm (gắn 1 lần cho cả lưới)
    document.getElementById("product-grid").addEventListener("click", function (e) {
        var card = e.target.closest(".product-card");
        if (!card) return;

        var sizeBtn = e.target.closest(".size-btn");
        if (sizeBtn) {
            card.querySelectorAll(".size-btn").forEach(function (b) { b.classList.remove("selected"); });
            sizeBtn.classList.add("selected");
            return;
        }

        var colorBtn = e.target.closest(".color-dot");
        if (colorBtn) {
            card.querySelectorAll(".color-dot").forEach(function (b) { b.classList.remove("selected"); });
            colorBtn.classList.add("selected");
            return;
        }

        var wishBtn = e.target.closest(".btn-wish");
        if (wishBtn) {
            toggleWish(card.getAttribute("data-id"), wishBtn);
            return;
        }

        if (e.target.closest(".btn-add")) {
            addToCart(card);
            return;
        }

        // mua ngay: thêm vào giỏ rồi chuyển sang trang giỏ hàng
        if (e.target.closest(".btn-buy")) {
            if (addToCart(card)) {
                setTimeout(function () {
                    window.location.href = "giohang.html";
                }, 700);
            }
        }
    });

    // nút về đầu trang: cuộn xuống quá 400px thì hiện
    var backTop = document.querySelector(".back-to-top");
    window.addEventListener("scroll", function () {
        backTop.classList.toggle("show", window.scrollY > 400);
    });
}

/* ---------- Chạy khi tải trang ---------- */

document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);

    // từ khóa tìm kiếm: sanpham.html?q=...
    var q = params.get("q");
    if (q && q.trim() !== "") {
        state.keyword = q.trim();
        document.getElementById("search-input").value = state.keyword;
    }

    // danh mục từ trang chủ: sanpham.html?cat=dam
    var cat = params.get("cat");
    if (cat && document.querySelector("#category-menu [data-category='" + cat + "']")) {
        state.category = cat;
        document.querySelectorAll("#category-menu .link").forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("data-category") === cat);
        });
    }

    bindEvents();
    loadWishlist();
    applyFilters();
    updateCartBadge();
});
