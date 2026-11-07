/* ==========================================================
   MAISON MODE - TRANG DANH SÁCH SẢN PHẨM
   Chức năng: hiển thị sản phẩm, lọc danh mục, lọc giá, tìm kiếm,
   sắp xếp, phân trang, chọn size/màu, giỏ hàng (localStorage),
   yêu thích, thông báo toast, nút về đầu trang.
   ========================================================== */

/* ------------------------- CẤU HÌNH & DỮ LIỆU ------------------------- */
var PAGE_SIZE = 9;                 // Số sản phẩm mỗi trang
var CART_KEY = "mm_cart";          // Khóa giỏ hàng trong localStorage
var WISH_KEY = "mm_wishlist";      // Khóa danh sách yêu thích
var MAX_QTY = 20;                  // Số lượng tối đa mỗi dòng giỏ hàng

// Tên hiển thị của danh mục
var CATEGORY_NAME = {
    ao: "Áo", vay: "Váy", dam: "Đầm", quan: "Quần",
    khoac: "Áo khoác", phukien: "Phụ kiện"
};

// Bảng màu
var COLOR_HEX = {
    "Đen": "#1c1c1c", "Trắng": "#ffffff", "Be": "#d9c3a5", "Đỏ": "#b5253b",
    "Xanh navy": "#1f2f56", "Hồng": "#e8a3b5", "Xám": "#9a9a9a",
    "Nâu": "#6b4a32", "Xanh lá": "#4f7a5a", "Vàng": "#e0b84c"
};

var SIZES_CLOTHES = ["S", "M", "L", "XL"];
var SIZES_FREE = ["Free"];

/*
  Dữ liệu sản phẩm.
  tags : nhãn lọc (new / hot / sale) | cat : danh mục chính
  oldPrice > price => sản phẩm giảm giá
*/
var products = [
    { id: "sp001", name: "Áo sơ mi lụa cổ nơ thanh lịch", cat: "ao", tags: ["new"], price: 590000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Trắng", "Be", "Hồng"], photo: "images/sanpham/artboard_3_copy_2_a99a62e2ad464f4aba4d55a4889f3abe.webp" },
    { id: "sp002", name: "Áo kiểu tay phồng vải tweed", cat: "ao", tags: ["hot"], price: 720000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Đen", "Be"], photo: "images/sanpham/s65w23t001_40776133_9_46d65e6a02e74984a0c9c9d96fcffee2.webp" },
    { id: "sp003", name: "Chân váy chữ A xếp ly", cat: "vay", tags: ["new"], price: 480000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Đen", "Xanh navy", "Be"], photo: "images/sanpham/chan-vay-xep-ly-xoe-chu-a-mau-den-cv06-07.webp" },
    { id: "sp004", name: "Chân váy midi hoa nhí dáng xòe", cat: "vay", tags: ["hot", "sale"], price: 650000, oldPrice: 890000,
      sizes: SIZES_CLOTHES, colors: ["Xanh navy", "Hồng", "Xanh lá"], photo: "images/sanpham/chan-vay-midi-xoe-hoa-nhi-mau-xanh-cv10-23.webp" },
    { id: "sp005", name: "Đầm xòe công sở cổ lệch xếp ly", cat: "dam", tags: ["new", "hot"], price: 1190000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Xanh navy","Đen" , "Đỏ"], photo: "images/sanpham/dam-xoe-cong-so-co-lech-xep-ly-kk185-20.webp" },
    { id: "sp006", name: "Đầm dạ hội satin đuôi cá", cat: "dam", tags: ["sale"], price: 1890000, oldPrice: 2490000,
      sizes: SIZES_CLOTHES, colors: ["Đỏ", "Đen"], photo: "images/sanpham/vay-da-hoi-do-ta-dai-duoi-ca-1.jpg" },
    { id: "sp007", name: "Quần culottes ống rộng lưng cao", cat: "quan", tags: ["hot"], price: 550000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Be","Đen" , "Xám"], photo: "images/sanpham/quan-culottes-nu-dang-lung-ong-rong-qcs02-33.webp" },
    { id: "sp008", name: "Quần tây ống đứng công sở", cat: "quan", tags: ["sale"], price: 490000, oldPrice: 650000,
      sizes: SIZES_CLOTHES, colors: ["Đen", "Xám"], photo: "images/sanpham/quan-tay-dung-qde017-2.jpg" },
    { id: "sp009", name: "Áo khoác blazer dáng dài", cat: "khoac", tags: ["new", "hot"], price: 1490000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Đen", "Be", "Xám"], photo: "images/sanpham/76c2a8d34e380353c8a26cfa4263e5062b34cd26.avif" },
    { id: "sp010", name: "Áo khoác dạ lông cừu cổ vest", cat: "khoac", tags: ["sale"], price: 2290000, oldPrice: 2990000,
      sizes: SIZES_CLOTHES, colors: ["Nâu", "Xám"], photo: "images/sanpham/O1CN01Jnj4Pr1owsG5RgAhD_!!996795290-0-cib.jpg_960x960q90.jpg" },
    { id: "sp011", name: "Chân váy ngắn xếp ly", cat: "phukien", tags: ["hot"], price: 890000, oldPrice: 0,
      sizes: SIZES_FREE, colors: ["Đen", "Nâu", "Be"], photo: "images/sanpham/chan-vay-tag-sat-ecochic-den.png" },
    { id: "sp012", name: "Áo sơ mi denim tay dài", cat: "phukien", tags: ["new"], price: 320000, oldPrice: 0,
      sizes: SIZES_FREE, colors: ["Xanh navy", "Vàng"], photo: "images/sanpham/goods_67_470735_3x4.avif" },
    { id: "sp013", name: "Áo len cổ lọ dệt kim mềm", cat: "ao", tags: ["sale"], price: 420000, oldPrice: 560000,
      sizes: SIZES_CLOTHES, colors: ["Be", "Xám", "Đen"], photo: "images/sanpham/6892-ao-len-co-lo-mau-tron-7.jpg" },
    { id: "sp014", name: "Đầm xòe tiệc linen dài cổ thuyền", cat: "dam", tags: [], price: 780000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Be", "Trắng"], photo: "images/sanpham/d_m_x_e_d__ti_c_phom_d_i_d4529t_m_u_kem_9826a6e633ae4e6e9f33012f8eba5564_master.webp" },
    { id: "sp015", name: "Chân váy bút chì đen xẻ trước", cat: "vay", tags: [], price: 450000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Đen", "Xanh navy"], photo: "images/sanpham/chan-vay-but-chi-den-xe-truoc-cv04-06.webp" },
    { id: "sp016", name: "Áo khoác cardigan dáng lửng", cat: "khoac", tags: ["new"], price: 690000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Hồng", "Be", "Xám"], photo: "images/sanpham/40ebe98051bc245f23e2a3c9413668a671840c55.avif" },
    { id: "sp017", name: "Quần suông dài ống rộng lưng cao", cat: "phukien", tags: ["sale"], price: 260000, oldPrice: 380000,
      sizes: SIZES_FREE, colors: ["Đen","Trắng" ], photo: "images/sanpham/quan-suong-dai-ong-rong-lung-cao-qcs02-17.webp" },
    { id: "sp018", name: "Quần jeans ống loe cạp cao", cat: "quan", tags: ["new"], price: 520000, oldPrice: 0,
      sizes: SIZES_CLOTHES, colors: ["Xanh navy", "Đen"], photo: "images/sanpham/quan-jeans-nu-ong-loe-cap-cao-qj-17.webp" }
];

// Trạng thái bộ lọc hiện tại
var state = { category: "all", price: "all", sort: "default", page: 1, keyword: "" };

// Lựa chọn size / màu của từng thẻ sản phẩm (chưa thêm vào giỏ)
var picked = {};

/* ------------------------- TIỆN ÍCH ------------------------- */
// Định dạng tiền Việt Nam
function formatMoney(n) {
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

// Chống chèn mã HTML từ dữ liệu / từ khóa
function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

// Bỏ dấu tiếng Việt để tìm kiếm thân thiện ("ao so mi" vẫn ra "Áo sơ mi")
function removeAccent(str) {
    return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

function getProduct(id) {
    return products.find(function (p) { return p.id === id; });
}

function discountPercent(p) {
    return p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
}

// Ảnh thay thế khi thiếu file ảnh (SVG nhúng sẵn)
var PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>" +
    "<rect width='100%' height='100%' fill='#efe9df'/>" +
    "<text x='50%' y='50%' fill='#a39a8d' font-family='Arial' font-size='28' text-anchor='middle'>Maison Mode</text></svg>");

/* ------------------------- LỌC / SẮP XẾP ------------------------- */
function getFilteredProducts() {
    var list = products.filter(function (p) {
        // 1. Danh mục
        var okCat = state.category === "all" ||
            p.cat === state.category || p.tags.indexOf(state.category) !== -1;

        // 2. Khoảng giá
        var okPrice = true;
        if (state.price !== "all") {
            var range = state.price.split("-");
            okPrice = p.price >= Number(range[0]) && p.price <= Number(range[1]);
        }

        // 3. Từ khóa (tên + tên danh mục)
        var okKey = true;
        if (state.keyword) {
            var text = removeAccent(p.name + " " + CATEGORY_NAME[p.cat]);
            okKey = text.indexOf(removeAccent(state.keyword)) !== -1;
        }
        return okCat && okPrice && okKey;
    });

    // 4. Sắp xếp
    switch (state.sort) {
        case "price-asc":  list.sort(function (a, b) { return a.price - b.price; }); break;
        case "price-desc": list.sort(function (a, b) { return b.price - a.price; }); break;
        case "name-asc":   list.sort(function (a, b) { return a.name.localeCompare(b.name, "vi"); }); break;
        case "discount":   list.sort(function (a, b) { return discountPercent(b) - discountPercent(a); }); break;
    }
    return list;
}

/* ------------------------- HIỂN THỊ ------------------------- */
function buildCard(p, index) {
    var wishes = getWishlist();
    var isWish = wishes.indexOf(p.id) !== -1;
    var off = discountPercent(p);

    // Huy hiệu
    var badges = "";
    if (p.tags.indexOf("new") !== -1)  badges += "<span class='badge badge-new'>NEW</span>";
    if (p.tags.indexOf("hot") !== -1)  badges += "<span class='badge badge-hot'>HOT</span>";
    if (off > 0)                       badges += "<span class='badge badge-sale'>-" + off + "%</span>";

    // Giá
    var price = off > 0
        ? "<ins class='price-new'>" + formatMoney(p.price) + "</ins>" +
          "<del class='price-old'>" + formatMoney(p.oldPrice) + "</del>"
        : "<ins class='price-new'>" + formatMoney(p.price) + "</ins>";

    // Màu
    var colors = p.colors.map(function (c, i) {
        return "<button type='button' class='color-dot" + (i === 0 ? " selected" : "") + "' " +
               "data-color='" + escapeHTML(c) + "' title='" + escapeHTML(c) + "' " +
               "style='background-color:" + COLOR_HEX[c] + "'></button>";
    }).join("");

    // Size
    var sizes = p.sizes.map(function (s, i) {
        return "<button type='button' class='size-btn" + (i === 0 ? " selected" : "") + "' data-size='" + s + "'>" + s + "</button>";
    }).join("");

    return "" +
    "<article class='product-card' data-id='" + p.id + "' style='animation-delay:" + (index * 0.05) + "s'>" +
        "<div class='badges'>" + badges + "</div>" +
        "<button type='button' class='btn-wish" + (isWish ? " active" : "") + "' title='Yêu thích'>" +
            "<i class='" + (isWish ? "fa-solid" : "fa-regular") + " fa-heart'></i></button>" +
        "<a class='product-thumb' href='chitiet.html?id=" + p.id + "'>" +
            "<img src='" + p.photo + "' alt='" + escapeHTML(p.name) + "' loading='lazy' onerror=\"this.onerror=null;this.src=PLACEHOLDER\">" +
        "</a>" +
        "<div class='product-info'>" +
            "<p class='product-cat'>" + CATEGORY_NAME[p.cat] + "</p>" +
            "<h2 class='product-title'><a href='chitiet.html?id=" + p.id + "'>" + escapeHTML(p.name) + "</a></h2>" +
            "<p class='product-price'>" + price + "</p>" +
            "<div class='color-list'>" + colors + "</div>" +
            "<div class='size-list'>" + sizes + "</div>" +
            "<div class='product-actions'>" +
                "<input type='number' class='quantity-input' value='1' min='1' max='" + MAX_QTY + "' aria-label='Số lượng'>" +
                "<button type='button' class='btn-action btn-add' title='Thêm vào giỏ hàng'><i class='fa-solid fa-bag-shopping'></i> Thêm vào giỏ</button>" +
                "<button type='button' class='btn-action btn-buy' title='Mua ngay'>Mua ngay</button>" +
            "</div>" +
        "</div>" +
    "</article>";
}

function renderProducts() {
    var grid = document.getElementById("product-grid");
    var list = getFilteredProducts();
    var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = list.slice(start, start + PAGE_SIZE);

    // Số lượng kết quả
    var countEl = document.getElementById("result-count");
    countEl.innerHTML = "Hiển thị <b>" + pageItems.length + "</b> / <b>" + list.length + "</b> sản phẩm" +
        (state.keyword ? " cho từ khóa \"<b>" + escapeHTML(state.keyword) + "</b>\"" : "");

    if (list.length === 0) {
        grid.innerHTML = "<div class='empty-state'><i class='fa-regular fa-face-frown'></i>" +
            "<h3>Không tìm thấy sản phẩm phù hợp</h3><p>Hãy thử đổi bộ lọc hoặc từ khóa khác.</p>" +
            "<button type='button' class='btn-reset' id='btn-reset'>Xóa bộ lọc</button></div>";
    } else {
        grid.innerHTML = pageItems.map(buildCard).join("");
    }
    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    var box = document.getElementById("pagination");
    if (totalPages <= 1) { box.innerHTML = ""; return; }

    var html = "<button class='page-btn' data-page='" + (state.page - 1) + "'" +
               (state.page === 1 ? " disabled" : "") + "><i class='fa-solid fa-angle-left'></i></button>";
    for (var i = 1; i <= totalPages; i++) {
        html += "<button class='page-btn" + (i === state.page ? " active" : "") + "' data-page='" + i + "'>" + i + "</button>";
    }
    html += "<button class='page-btn' data-page='" + (state.page + 1) + "'" +
            (state.page === totalPages ? " disabled" : "") + "><i class='fa-solid fa-angle-right'></i></button>";
    box.innerHTML = html;
}

/* ------------------------- GIỎ HÀNG ------------------------- */
// Cấu trúc: [{ id, size, color, qty }, ...]
function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
    var total = getCart().reduce(function (sum, it) { return sum + it.qty; }, 0);
    document.querySelectorAll(".cart-badge").forEach(function (b) { b.textContent = total; });
}

// Thêm vào giỏ; trả về true nếu thành công
function addToCart(card) {
    var id = card.getAttribute("data-id");
    var p = getProduct(id);
    var qty = parseInt(card.querySelector(".quantity-input").value, 10);

    if (isNaN(qty) || qty <= 0) {
        showToast("Số lượng không hợp lệ, vui lòng nhập lại!", "error");
        return false;
    }
    if (qty > MAX_QTY) qty = MAX_QTY;

    var sizeEl = card.querySelector(".size-btn.selected");
    var colorEl = card.querySelector(".color-dot.selected");
    var size = sizeEl ? sizeEl.getAttribute("data-size") : p.sizes[0];
    var color = colorEl ? colorEl.getAttribute("data-color") : p.colors[0];

    var cart = getCart();
    var found = cart.find(function (it) { return it.id === id && it.size === size && it.color === color; });

    if (found) {
        found.qty = Math.min(found.qty + qty, MAX_QTY);
    } else {
        cart.push({ id: id, size: size, color: color, qty: qty });
    }
    saveCart(cart);
    updateCartBadge();
    showToast("Đã thêm \"" + p.name + "\" (" + color + ", " + size + ") vào giỏ hàng!");
    return true;
}

/* ------------------------- YÊU THÍCH ------------------------- */
function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
    catch (e) { return []; }
}

function toggleWish(id, btn) {
    var list = getWishlist();
    var idx = list.indexOf(id);
    var icon = btn.querySelector("i");
    if (idx === -1) {
        list.push(id);
        btn.classList.add("active");
        icon.className = "fa-solid fa-heart";
        showToast("Đã thêm vào danh sách yêu thích!");
    } else {
        list.splice(idx, 1);
        btn.classList.remove("active");
        icon.className = "fa-regular fa-heart";
    }
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
}

/* ------------------------- THÔNG BÁO TOAST ------------------------- */
function showToast(message, type) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
        wrap = document.createElement("div");
        wrap.className = "toast-wrap";
        document.body.appendChild(wrap);
    }
    var toast = document.createElement("div");
    toast.className = "toast" + (type === "error" ? " error" : "");
    toast.innerHTML = "<i class='fa-solid " + (type === "error" ? "fa-circle-exclamation" : "fa-circle-check") + "'></i><span>" +
        escapeHTML(message) + "</span>";
    wrap.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("hide");
        setTimeout(function () { toast.remove(); }, 350);
    }, 2800);
}

/* ------------------------- SỰ KIỆN ------------------------- */
function resetFilters() {
    state.category = "all";
    state.price = "all";
    state.sort = "default";
    state.keyword = "";
    state.page = 1;

    document.querySelectorAll("#category-menu .link").forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("data-category") === "all");
    });
    document.querySelector("input[name='price'][value='all']").checked = true;
    document.getElementById("sort-select").value = "default";
    document.getElementById("search-input").value = "";
    renderProducts();
}

function bindEvents() {
    // --- Lọc danh mục ---
    var links = document.querySelectorAll("#category-menu .link");
    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            links.forEach(function (l) { l.classList.remove("active"); });
            this.classList.add("active");
            state.category = this.getAttribute("data-category");
            state.page = 1;
            renderProducts();
        });
    });

    // --- Lọc giá ---
    document.querySelectorAll("input[name='price']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            state.price = this.value;
            state.page = 1;
            renderProducts();
        });
    });

    // --- Sắp xếp ---
    document.getElementById("sort-select").addEventListener("change", function () {
        state.sort = this.value;
        state.page = 1;
        renderProducts();
    });

    // --- Tìm kiếm: không cho gửi form rỗng ---
    document.getElementById("search-form").addEventListener("submit", function (e) {
        var input = document.getElementById("search-input");
        if (input.value.trim() === "") {
            e.preventDefault();
            showToast("Vui lòng nhập từ khóa tìm kiếm!", "error");
            input.focus();
        }
    });

    // --- Phân trang ---
    document.getElementById("pagination").addEventListener("click", function (e) {
        var btn = e.target.closest(".page-btn");
        if (!btn || btn.disabled) return;
        state.page = Number(btn.getAttribute("data-page"));
        renderProducts();
        document.querySelector(".toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // --- Sự kiện trong lưới sản phẩm (event delegation) ---
    document.getElementById("product-grid").addEventListener("click", function (e) {
        var card = e.target.closest(".product-card");

        if (e.target.closest("#btn-reset")) { resetFilters(); return; }
        if (!card) return;

        // Chọn size
        var sizeBtn = e.target.closest(".size-btn");
        if (sizeBtn) {
            card.querySelectorAll(".size-btn").forEach(function (b) { b.classList.remove("selected"); });
            sizeBtn.classList.add("selected");
            return;
        }
        // Chọn màu
        var colorBtn = e.target.closest(".color-dot");
        if (colorBtn) {
            card.querySelectorAll(".color-dot").forEach(function (b) { b.classList.remove("selected"); });
            colorBtn.classList.add("selected");
            return;
        }
        // Yêu thích
        var wishBtn = e.target.closest(".btn-wish");
        if (wishBtn) { toggleWish(card.getAttribute("data-id"), wishBtn); return; }

        // Thêm vào giỏ
        if (e.target.closest(".btn-add")) { addToCart(card); return; }

        // Mua ngay: thêm xong chuyển sang trang giỏ hàng
        if (e.target.closest(".btn-buy")) {
            if (addToCart(card)) {
                setTimeout(function () { window.location.href = "giohang.html"; }, 700);
            }
        }
    });

    // --- Nút về đầu trang ---
    var backTop = document.querySelector(".back-to-top");
    window.addEventListener("scroll", function () {
        backTop.classList.toggle("show", window.scrollY > 400);
    });
}

/* ------------------------- KHỞI CHẠY ------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    // Đọc từ khóa ?q= từ thanh địa chỉ (từ ô tìm kiếm ở header)
    var q = new URLSearchParams(window.location.search).get("q");
    if (q && q.trim() !== "") {
        state.keyword = q.trim();
        document.getElementById("search-input").value = state.keyword;
    }

    // Đọc danh mục ?cat= (ví dụ từ trang chủ: sanpham.html?cat=dam)
    var cat = new URLSearchParams(window.location.search).get("cat");
    if (cat && document.querySelector("#category-menu [data-category='" + cat + "']")) {
        state.category = cat;
        document.querySelectorAll("#category-menu .link").forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("data-category") === cat);
        });
    }

    bindEvents();
    renderProducts();
    updateCartBadge();
});
