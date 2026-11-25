// =========================================================
// MAISON MODE - XU LY GIO HANG (VANILLA JS)
// =========================================================

var STORAGE_KEY = "maison_cart";
var MUC_FREESHIP = 1000000;
var PHI_SHIP = 30000;

var danhSachGioHang = [];
var giamGiaHienTai = 0;

// Dinh dang so thanh tien VND (VD: 590.000đ)
function dinhDangTien(soTien) {
    var n = Number(soTien);
    if (isNaN(n)) {
        n = 0;
    }
    return n.toLocaleString("vi-VN") + "đ";
}

// Lay du lieu gio hang tu localStorage
function layDuLieuGioHang() {
    var duLieuTho = localStorage.getItem(STORAGE_KEY);
    if (!duLieuTho) {
        danhSachGioHang = [];
        return;
    }

    try {
        var mang = JSON.parse(duLieuTho);
        if (!Array.isArray(mang)) {
            danhSachGioHang = [];
            return;
        }

        danhSachGioHang = [];
        for (var i = 0; i < mang.length; i++) {
            var sp = mang[i];

            // Xu ly gia neu ben trang san pham luu dang chuoi co chu "đ" hoac dau cham
            var giaSo = 0;
            if (typeof sp.price === "number") {
                giaSo = sp.price;
            } else if (typeof sp.price === "string") {
                giaSo = Number(sp.price.replace(/[^\d]/g, "")) || 0;
            }

            // Bo dau "/" o dau duong dan anh neu co
            var linkAnh = sp.image || sp.img || "";
            if (linkAnh.charAt(0) === "/") {
                linkAnh = linkAnh.substring(1);
            }

            var sl = Number(sp.quantity || sp.qty);
            if (!sl || sl < 1) {
                sl = 1;
            }

            danhSachGioHang.push({
                id: sp.id || "sp" + i,
                name: sp.name || sp.title || "Sản phẩm",
                price: giaSo,
                image: linkAnh,
                color: sp.color || "Mặc định",
                size: sp.size || "M",
                quantity: sl,
                checked: sp.checked === false ? false : true
            });
        }
    } catch (loi) {
        danhSachGioHang = [];
    }
}

function saveCartToStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function updateHeaderBadge() {
    const badge = document.querySelector(".cart-badge");
    if (!badge) return;

    let totalQty = 0;
    for (let i = 0; i < cartItems.length; i++) {
        totalQty += cartItems[i].quantity;
    }
    badge.textContent = String(totalQty);
}

// Tao 1 dong san pham trong gio hang
function taoDongSanPham(sp, viTri) {
    var article = document.createElement("article");
    article.className = "cart-item";

    // Checkbox chon san pham
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-check";
    checkbox.checked = sp.checked;
    checkbox.addEventListener("change", function () {
        danhSachGioHang[viTri].checked = checkbox.checked;
        luuGioHang();
        tinhTongTien();
        kiemTraChonTatCa();
    });
    article.appendChild(checkbox);

    // Khung anh san pham
    var khungAnh = document.createElement("div");
    khungAnh.className = "item-thumb";
    if (sp.image !== "") {
        var img = document.createElement("img");
        img.src = sp.image;
        img.alt = sp.name;
        khungAnh.appendChild(img);
    }
    article.appendChild(khungAnh);

    // Thong tin chi tiet (ten, mau, size, don gia)
    var thongTin = document.createElement("div");
    thongTin.className = "item-details";

    var tenSp = document.createElement("h2");
    tenSp.className = "item-name";
    tenSp.textContent = sp.name;
    thongTin.appendChild(tenSp);

    var bienThe = document.createElement("div");
    bienThe.className = "item-variants";

    var spanMau = document.createElement("span");
    spanMau.textContent = "Màu: ";
    var bMau = document.createElement("b");
    bMau.textContent = sp.color;
    spanMau.appendChild(bMau);
    bienThe.appendChild(spanMau);

    var labelSize = document.createElement("label");
    labelSize.textContent = "Size: ";
    var selectSize = document.createElement("select");
    selectSize.className = "item-size-select";

    var dsSize = ["S", "M", "L", "XL"];
    for (var s = 0; s < dsSize.length; s++) {
        var opt = document.createElement("option");
        opt.value = dsSize[s];
        opt.textContent = dsSize[s];
        if (sp.size === dsSize[s]) {
            opt.selected = true;
        }
        selectSize.appendChild(opt);
    }

    selectSize.addEventListener("change", function () {
        danhSachGioHang[viTri].size = selectSize.value;
        luuGioHang();
    });

    labelSize.appendChild(selectSize);
    bienThe.appendChild(labelSize);
    thongTin.appendChild(bienThe);

    var donGia = document.createElement("p");
    donGia.className = "item-unit-price";
    donGia.textContent = dinhDangTien(sp.price);
    thongTin.appendChild(donGia);

    article.appendChild(thongTin);

    // Khu vuc tang giam so luong, thanh tien, nut xoa
    var cotPhai = document.createElement("div");
    cotPhai.className = "item-side";

    var cumSoLuong = document.createElement("div");
    cumSoLuong.className = "qty-control";

    var nutGiam = document.createElement("button");
    nutGiam.type = "button";
    nutGiam.className = "qty-btn btn-minus";
    nutGiam.textContent = "-";

    var oSoLuong = document.createElement("input");
    oSoLuong.type = "number";
    oSoLuong.className = "qty-input";
    oSoLuong.min = "1";
    oSoLuong.max = "20";
    oSoLuong.value = sp.quantity;

    var nutTang = document.createElement("button");
    nutTang.type = "button";
    nutTang.className = "qty-btn btn-plus";
    nutTang.textContent = "+";

    var thanhTien = document.createElement("div");
    thanhTien.className = "item-subtotal";
    thanhTien.textContent = dinhDangTien(sp.price * sp.quantity);

    function doiSoLuong(soMoi) {
        var slHopLe = Number(soMoi);
        if (!slHopLe || slHopLe < 1) {
            slHopLe = 1;
        }
        if (slHopLe > 20) {
            slHopLe = 20;
        }
        danhSachGioHang[viTri].quantity = slHopLe;
        oSoLuong.value = slHopLe;
        thanhTien.textContent = dinhDangTien(danhSachGioHang[viTri].price * slHopLe);
        luuGioHang();
        tinhTongTien();
    }

    nutGiam.addEventListener("click", function () {
        doiSoLuong(danhSachGioHang[viTri].quantity - 1);
    });

    nutTang.addEventListener("click", function () {
        doiSoLuong(danhSachGioHang[viTri].quantity + 1);
    });

    oSoLuong.addEventListener("change", function () {
        doiSoLuong(oSoLuong.value);
    });

    cumSoLuong.appendChild(nutGiam);
    cumSoLuong.appendChild(oSoLuong);
    cumSoLuong.appendChild(nutTang);
    cotPhai.appendChild(cumSoLuong);
    cotPhai.appendChild(thanhTien);

    var nutXoa = document.createElement("button");
    nutXoa.type = "button";
    nutXoa.className = "btn-remove-item";
    nutXoa.title = "Xóa sản phẩm";

    var iconXoa = document.createElement("i");
    iconXoa.className = "fa-solid fa-xmark";
    nutXoa.appendChild(iconXoa);

    nutXoa.addEventListener("click", function () {
        danhSachGioHang.splice(viTri, 1);
        luuGioHang();
        hienThiGioHang();
    });

    cotPhai.appendChild(nutXoa);
    article.appendChild(cotPhai);

    return article;
}

// Hien thi toan bo danh sach len giao dien
function hienThiGioHang() {
    var khungDanhSach = document.getElementById("cart-list");
    var khungTrong = document.getElementById("cart-empty");
    var khungChinh = document.getElementById("cart-layout");

    if (!khungDanhSach) return;
    khungDanhSach.textContent = "";

    if (cartItems.length === 0) {
        if (emptyBox) emptyBox.style.display = "block";
        if (layoutBox) layoutBox.style.display = "none";
        updateHeaderBadge();
        renderSummary();
        return;
    }

    if (khungTrong) khungTrong.style.display = "none";
    if (khungChinh) khungChinh.style.display = "";

    for (var i = 0; i < danhSachGioHang.length; i++) {
        var dong = taoDongSanPham(danhSachGioHang[i], i);
        khungDanhSach.appendChild(dong);
    }

    syncSelectAllCheckbox();
    updateHeaderBadge();
    renderSummary();
}

// Cap nhat checkbox "Chon tat ca" va so san pham dang chon
function kiemTraChonTatCa() {
    var chonTatCa = document.getElementById("select-all");
    var soDaChon = document.getElementById("total-selected");

    var dem = 0;
    for (var i = 0; i < danhSachGioHang.length; i++) {
        if (danhSachGioHang[i].checked) {
            dem++;
        }
    }

    if (soDaChon) {
        soDaChon.textContent = dem;
    }
    if (chonTatCa) {
        chonTatCa.checked = danhSachGioHang.length > 0 && dem === danhSachGioHang.length;
    }
}

// Tinh tam tinh, giam gia, phi ship, tong thanh toan
function tinhTongTien() {
    var elTamTinh = document.getElementById("subtotal-price");
    var elGiamGia = document.getElementById("discount-price");
    var elPhiShip = document.getElementById("shipping-price");
    var elTongCuoi = document.getElementById("final-total");

    var tamTinh = 0;
    for (var i = 0; i < danhSachGioHang.length; i++) {
        if (danhSachGioHang[i].checked) {
            tamTinh += danhSachGioHang[i].price * danhSachGioHang[i].quantity;
        }
    }

    var tienGiam = 0;
    if (tamTinh > 0 && giamGiaHienTai > 0) {
        if (giamGiaHienTai < 1) {
            tienGiam = Math.round(tamTinh * giamGiaHienTai);
        } else {
            tienGiam = giamGiaHienTai;
            if (tienGiam > tamTinh) {
                tienGiam = tamTinh;
            }
        }
    }

    var sauGiam = tamTinh - tienGiam;
    var phiShip = 0;
    if (sauGiam > 0 && sauGiam < MUC_FREESHIP) {
        phiShip = PHI_SHIP;
    }

    var tongThanhToan = sauGiam + phiShip;

    if (elTamTinh) elTamTinh.textContent = dinhDangTien(tamTinh);
    if (elGiamGia) elGiamGia.textContent = "-" + dinhDangTien(tienGiam);
    if (elPhiShip) elPhiShip.textContent = dinhDangTien(phiShip);
    if (elTongCuoi) elTongCuoi.textContent = dinhDangTien(tongThanhToan);
}

// Gan su kien cho cac nut chung tren trang
function ganSuKienChung() {
    var chonTatCa = document.getElementById("select-all");
    if (chonTatCa) {
        chonTatCa.addEventListener("change", function () {
            for (var i = 0; i < danhSachGioHang.length; i++) {
                danhSachGioHang[i].checked = chonTatCa.checked;
            }
            luuGioHang();
            hienThiGioHang();
        });
    }

    var nutXoaTatCa = document.getElementById("btn-clear-cart");
    if (nutXoaTatCa) {
        nutXoaTatCa.addEventListener("click", function () {
            if (danhSachGioHang.length === 0) return;
            if (confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
                danhSachGioHang = [];
                giamGiaHienTai = 0;
                luuGioHang();
                hienThiGioHang();
            }
        });
    }

    var nutApMa = document.getElementById("btn-apply-coupon");
    var oNhapMa = document.getElementById("coupon-input");
    if (nutApMa && oNhapMa) {
        nutApMa.addEventListener("click", function () {
            var ma = oNhapMa.value.trim().toUpperCase();
            if (ma === "") {
                alert("Vui lòng nhập mã giảm giá.");
                return;
            }
            if (ma === "MAISON10") {
                giamGiaHienTai = 0.1;
                tinhTongTien();
                alert("Áp dụng thành công mã giảm 10%.");
            } else if (ma === "SALE50K") {
                giamGiaHienTai = 50000;
                tinhTongTien();
                alert("Áp dụng thành công mã giảm 50.000đ.");
            } else {
                giamGiaHienTai = 0;
                tinhTongTien();
                alert("Mã giảm giá không hợp lệ (thử MAISON10 hoặc SALE50K).");
            }
        });
    }

    var nutThanhToan = document.getElementById("btn-checkout");
    if (nutThanhToan) {
        nutThanhToan.addEventListener("click", function () {
            var coSanPham = false;
            for (var i = 0; i < danhSachGioHang.length; i++) {
                if (danhSachGioHang[i].checked) {
                    coSanPham = true;
                    break;
                }
            }
            if (!coSanPham) {
                alert("Bạn chưa chọn sản phẩm nào để thanh toán.");
                return;
            }
            window.location.href = "thanhtoan.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    layDuLieuGioHang();
    ganSuKienChung();
    hienThiGioHang();
});