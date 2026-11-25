function capNhatIconGioHang() {
    var total = 0;
    var cart = JSON.parse(localStorage.getItem("maison_cart")) || [];
    cart.forEach(function (item) {
        total += item.quantity;
    });
    document.querySelectorAll(".cart-badge").forEach(function (badge) {
        badge.textContent = total;
    });
}

capNhatIconGioHang();

window.addEventListener("storage", function (evt) {
    if (evt.key === "maison_cart") {
        capNhatIconGioHang();
    }
});
