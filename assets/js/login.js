let currentToast = null;

const showSuccess = (message) => {
    if (currentToast) currentToast.hideToast();

    if (typeof Toastify === "function") {
        currentToast = Toastify({
            text: message,
            duration: 4000,
            gravity: "top",
            position: "right",
            style: {
                background: "#22c55e",
                color: "#ffffff"
            }
        });

        currentToast.showToast();
    } else {
        alert(message);
    }
};

const showError = (message) => {
    if (currentToast) currentToast.hideToast();

    if (typeof Toastify === "function") {
        currentToast = Toastify({
            text: message,
            duration: 4000,
            gravity: "top",
            position: "right",
            style: {
                background: "#ef4444",
                color: "#ffffff"
            }
        });

        currentToast.showToast();
    } else {
        alert(message);
    }
};

const loginContainer = document.getElementById("login-form");
const registerContainer = document.getElementById("register-form");

const loginForm = loginContainer.querySelector(".form-box");
const registerForm = registerContainer.querySelector(".form-box");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const fullnameInput = document.getElementById("fullname");
const registerEmailInput = document.getElementById("register-email");
const registerPasswordInput = document.getElementById("register-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone-number");

const showRegister = () => {
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
};

const showLogin = () => {
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
};

window.showRegister = showRegister;
window.showLogin = showLogin;

const eyeIcons = document.querySelectorAll(".eye-icon");

eyeIcons.forEach((eye) => {
    eye.addEventListener("click", () => {

        const input = eye.parentElement.querySelector(".input-field");

        if (input.type === "password") {
            input.type = "text";
            eye.textContent = "👁";
        } else {
            input.type = "password";
            eye.textContent = "👁";
        }

    });
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0[0-9]{9}$/;

const getValue = (input) => {
    return input.value.trim();
};

const isValidEmail = (email) => {
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    return phoneRegex.test(phone);
};

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const fullname = getValue(fullnameInput);
    const email = getValue(registerEmailInput).toLowerCase();
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const address = getValue(addressInput);
    const phone = getValue(phoneInput);

    if (!fullname || !email || !password ||
        !confirmPassword || !address || !phone) {

        showError("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (!isValidEmail(email)) {
        showError("Email không đúng định dạng");
        return;
    }

    if (password.length < 8) {
        showError("Mật khẩu phải có ít nhất 8 ký tự");
        return;
    }

    if (password !== confirmPassword) {
        showError("Mật khẩu xác nhận không khớp");
        return;
    }

    if (!isValidPhone(phone)) {
        showError("Số điện thoại không hợp lệ");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const isExist = users.some((user) => user.email === email);

    if (isExist) {
        showError("Email này đã được đăng ký");
        return;
    }

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        fullname,
        email,
        password,
        address,
        phone
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    showSuccess("Đăng ký thành công!");

    registerForm.reset();

    showLogin();

    emailInput.value = email;

});


loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = getValue(emailInput).toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        showError("Vui lòng nhập email và mật khẩu");
        return;
    }

    if (!isValidEmail(email)) {
        showError("Email không đúng định dạng");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((item) =>
        item.email === email && item.password === password
    );

    if (!user) {
        showError("Email hoặc mật khẩu không chính xác");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    showSuccess("Đăng nhập thành công!");

    window.location.href = "trangchu.html";

});

const rememberCheckbox = document.getElementById("remember-me-checkbox");

const savedEmail = localStorage.getItem("rememberedEmail");

if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
}

loginForm.addEventListener("submit", () => {

    if (rememberCheckbox.checked) {
        localStorage.setItem("rememberedEmail", getValue(emailInput));
    } else {
        localStorage.removeItem("rememberedEmail");
    }

});
