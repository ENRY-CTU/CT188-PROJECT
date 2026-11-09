// Cái này sử dụng cho nhiều trang được//
document.addEventListener("DOMContentLoaded", function () {
    var backTop = document.querySelector(".back-to-top");
    if (!backTop) return;
    // Hiện nút khi cuộn xuống//
    window.addEventListener("scroll", function () {
        backTop.classList.toggle("show", window.scrollY > 400);
    });
    // Nhấn nút để về đầu trang//
    backTop.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});