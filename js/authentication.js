function checkAuthentication() {
    var authBox = document.getElementById("authentication");
    var userBox = document.getElementById("user-info");
    var tenHienThi = document.getElementById("principal");

    var userDaDangNhap = localStorage.getItem("currentUser");

    if (userDaDangNhap) {
        if (authBox) {
            authBox.classList.add("hidden");
        }
        if (userBox) {
            userBox.classList.remove("hidden");
        }
        if (tenHienThi) {
            tenHienThi.textContent = userDaDangNhap;
        }
    } else {
        if (authBox) {
            authBox.classList.remove("hidden");
        }
        if (userBox) {
            userBox.classList.add("hidden");
        }
    }
}
var nutDangXuat = document.getElementById("logout");
if (nutDangXuat) {
    nutDangXuat.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        checkAuthentication();
    });
}