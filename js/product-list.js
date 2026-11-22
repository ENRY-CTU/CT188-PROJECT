var soLuongGio = 0;
if (localStorage.getItem("soLuongGio")) {
    soLuongGio = parseInt(localStorage.getItem("soLuongGio"));
}

var oSoLuong = document.querySelector(".no-ordered-items");
if (oSoLuong) {
    oSoLuong.textContent = soLuongGio;
}
var cacSanPham = document.querySelectorAll(".page-main .item");

for (var i = 0; i < cacSanPham.length; i++) {
    (function (sanPham) {
        var cacSize = sanPham.querySelectorAll(".size-option");
        for (var j = 0; j < cacSize.length; j++) {
            cacSize[j].addEventListener("click", function () {
                for (var k = 0; k < cacSize.length; k++) {
                    cacSize[k].classList.remove("active");
                }
                this.classList.add("active");
            });
        }

        var nutThem = sanPham.querySelector(".add-cart");
        if (nutThem) {
            nutThem.addEventListener("click", function (e) {
                e.preventDefault();

                var tenSp = sanPham.querySelector(".item-title");
                var sizeDangChon = sanPham.querySelector(".size-option.active");
                var tenText = tenSp ? tenSp.textContent : "San pham";
                var sizeText = sizeDangChon ? sizeDangChon.textContent : "";

                soLuongGio = soLuongGio + 1;
                if (oSoLuong) {
                    oSoLuong.textContent = soLuongGio;
                }
                localStorage.setItem("soLuongGio", soLuongGio);

                if (sizeText !== "") {
                    alert("Da them: " + tenText + " (Size " + sizeText + ")");
                } else {
                    alert("Da them: " + tenText);
                }
            });
        }
    })(cacSanPham[i]);
}
var nutLoc = document.querySelectorAll(".filter-btn");
var oTimKiem = document.getElementById("product-search-input");
var danhMucHienTai = "all";

function locSanPham() {
    var tuKhoa = "";
    if (oTimKiem) {
        tuKhoa = oTimKiem.value.toLowerCase().trim();
    }

    for (var i = 0; i < cacSanPham.length; i++) {
        var loaiSp = cacSanPham[i].getAttribute("data-category");
        var tenSpEl = cacSanPham[i].querySelector(".item-title");
        var tenSp = tenSpEl ? tenSpEl.textContent.toLowerCase() : "";

        var khopDanhMuc = (danhMucHienTai === "all" || loaiSp === danhMucHienTai);
        var khopTuKhoa = (tuKhoa === "" || tenSp.indexOf(tuKhoa) !== -1);

        if (khopDanhMuc && khopTuKhoa) {
            cacSanPham[i].style.display = "";
        } else {
            cacSanPham[i].style.display = "none";
        }
    }
}
for (var i = 0; i < nutLoc.length; i++) {
    nutLoc[i].addEventListener("click", function () {
        for (var j = 0; j < nutLoc.length; j++) {
            nutLoc[j].classList.remove("active");
        }
        this.classList.add("active");
        danhMucHienTai = this.getAttribute("data-filter");
        locSanPham();
    });
}
if (oTimKiem) {
    oTimKiem.addEventListener("input", function () {
        locSanPham();
    });
}