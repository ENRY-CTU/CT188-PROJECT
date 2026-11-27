var user = JSON.parse(sessionStorage.getItem("currentUser"));

if (user != null) {

    var userButtons = document.querySelector(".user-buttons");
 
    while (userButtons.firstChild) {
        userButtons.removeChild(userButtons.firstChild);
    }
    var tenNguoiDung = document.createElement("span");
    tenNguoiDung.className = "btn-user user-name";
    tenNguoiDung.textContent = user.fullname;
 
    var nutDangXuat = document.createElement("a");
    nutDangXuat.className = "btn-user btn-login";
    nutDangXuat.href = "#";
    nutDangXuat.textContent = "Đăng Xuất";
    nutDangXuat.onclick = dangXuat;
 
    userButtons.appendChild(tenNguoiDung);
    userButtons.appendChild(nutDangXuat);
 
    var mobileLinks = document.querySelectorAll(".mobile-auth .nav-link");
 
    mobileLinks[0].textContent = "Xin chào, " + user.fullname;
    mobileLinks[0].href = "#";
 
    mobileLinks[1].textContent = "Đăng Xuất";
    mobileLinks[1].href = "#";
    mobileLinks[1].onclick = dangXuat;
}
 
function dangXuat() {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserName")
        window.location.href = "trangchu.html";
    }
    return false;
}
