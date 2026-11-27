// Dam bao moi tai khoan chi co 1 gio hang rieng
function layKeyGioHang(){
    var nguoiDung = JSON.parse(sessionStorage.getItem("currentUser"));
    if(nguoiDung === null){
        return "maison_cart_khach";
    }
    return "maison_cart" + nguoiDung.email; 
}
function capNhatIconGioHang() {
    var total = 0;
    var cart = JSON.parse(localStorage.getItem(layKeyGioHang())) || [];
    cart.forEach(function (item) {
        total += item.quantity;
    });
    document.querySelectorAll(".cart-badge").forEach(function (badge) {
        badge.textContent = total;
    });
}

capNhatIconGioHang();

window.addEventListener("storage", function (evt) {
    if (evt.key === layKeyGioHang()) {
        capNhatIconGioHang();
    }
});
