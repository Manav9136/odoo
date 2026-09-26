
let generatedOTP = "";

let otpEmail = "";

function showLogin() {

    document.getElementById("loginForm").style.display =
        "block";

    document.getElementById("signupForm").style.display =
        "none";

    document.getElementById("forgotForm").style.display =
        "none";

}

function showSignup() {

    document.getElementById("loginForm").style.display =
        "none";

    document.getElementById("signupForm").style.display =
        "block";

    document.getElementById("forgotForm").style.display =
        "none";

}

function login(event) {

    event.preventDefault();


    const loginId =
        document.getElementById("loginId")
        .value
        .trim();


    const password =
        document.getElementById("password")
        .value;


    const message =
        document.getElementById("loginMessage");

    const savedId =
        localStorage.getItem("stocksenseLoginId");


    const savedPassword =
        localStorage.getItem("stocksensePassword");

    if (
        loginId === "admin" &&
        password === "admin123"
    ) {

        message.style.color =
            "green";

        message.innerHTML =
            "✓ Login successful! Redirecting...";


        setTimeout(function() {

            window.location.href =
                "dashboard.html";

        }, 1000);


        return;
    }

    if (
        savedId &&
        savedPassword &&
        loginId === savedId &&
        password === savedPassword
    ) {

        message.style.color =
            "green";

        message.innerHTML =
            "✓ Login successful! Redirecting...";


        setTimeout(function() {

            window.location.href =
                "dashboard.html";

        }, 1000);


        return;
    }

    message.style.color =
        "red";

    message.innerHTML =
        "✗ Invalid Login ID or Password.";

}

function signup(event) {

    event.preventDefault();


    const loginId =
        document.getElementById("signupId")
        .value
        .trim();


    const email =
        document.getElementById("email")
        .value
        .trim();


    const password =
        document.getElementById("signupPassword")
        .value;


    const confirmPassword =
        document.getElementById("confirmPassword")
        .value;


    const message =
        document.getElementById("signupMessage");

    if (
        loginId.length < 6 ||
        loginId.length > 12
    ) {

        message.style.color =
            "red";

        message.innerHTML =
            "Login ID must contain 6-12 characters.";

        return;
    }

    if (password.length < 8) {

        message.style.color =
            "red";

        message.innerHTML =
            "Password must contain at least 8 characters.";

        return;
    }

    if (
        password !== confirmPassword
    ) {

        message.style.color =
            "red";

        message.innerHTML =
            "✗ Passwords do not match.";

        return;
    }

    localStorage.setItem(
        "stocksenseLoginId",
        loginId
    );


    localStorage.setItem(
        "stocksenseEmail",
        email
    );


    localStorage.setItem(
        "stocksensePassword",
        password
    );



    message.style.color =
        "green";

    message.innerHTML =
        "✓ Account created successfully!";



    setTimeout(function() {

        showLogin();

    }, 1200);

}

function forgotPassword() {

    document.getElementById("loginForm").style.display =
        "none";

    document.getElementById("signupForm").style.display =
        "none";

    document.getElementById("forgotForm").style.display =
        "block";

    document.getElementById("emailSection").style.display =
        "block";

    document.getElementById("otpSection").style.display =
        "none";

    document.getElementById("resetSection").style.display =
        "none";

}

function sendOTP(event) {

    event.preventDefault();


    const email =
        document.getElementById("forgotEmail")
        .value
        .trim();

    const savedEmail =
        localStorage.getItem("stocksenseEmail");

    const message =
        document.getElementById("forgotMessage");

    if (!email) {

        message.style.color =
            "red";

        message.innerHTML =
            "Please enter your email.";

        return;
    }

    if (
        savedEmail &&
        email !== savedEmail
    ) {

        message.style.color =
            "red";

        message.innerHTML =
            "✗ Email is not registered.";

        return;
    }

    generatedOTP =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

    otpEmail = email;

    alert(
        "StockSense OTP: " +
        generatedOTP
    );

    message.style.color =
        "green";

    message.innerHTML =
        "✓ OTP generated successfully. Check the OTP popup.";

    document.getElementById("emailSection").style.display =
        "none";

    document.getElementById("otpSection").style.display =
        "block";

}

function verifyOTP(event) {

    event.preventDefault();

    const enteredOTP =
        document.getElementById("otpInput")
        .value
        .trim();

    const message =
        document.getElementById("otpMessage");

    if (!enteredOTP) {

        message.style.color =
            "red";

        message.innerHTML =
            "Please enter OTP.";

        return;
    }

    if (
        enteredOTP === generatedOTP
    ) {

        message.style.color =
            "green";

        message.innerHTML =
            "✓ OTP verified successfully!";

        document.getElementById("otpSection").style.display =
            "none";

        document.getElementById("resetSection").style.display =
            "block";

    }

    else {

        message.style.color =
            "red";

        message.innerHTML =
            "✗ Invalid OTP. Please try again.";

    }

}

function resendOTP() {

    if (!otpEmail) {

        return;
    }

    generatedOTP =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

    alert(
        "New StockSense OTP: " +
        generatedOTP
    );

    document.getElementById("otpMessage").style.color =
        "green";


    document.getElementById("otpMessage").innerHTML =
        "✓ New OTP generated.";

}

function resetPassword(event) {

    event.preventDefault();


    const newPassword =
        document.getElementById("newPassword")
        .value;


    const confirmPassword =
        document.getElementById("newConfirmPassword")
        .value;


    const message =
        document.getElementById("resetMessage");

    if (
        newPassword.length < 8
    ) {

        message.style.color =
            "red";

        message.innerHTML =
            "Password must contain at least 8 characters.";

        return;
    }

    if (
        newPassword !== confirmPassword
    ) {

        message.style.color =
            "red";

        message.innerHTML =
            "✗ Passwords do not match.";

        return;
    }

    localStorage.setItem(
        "stocksensePassword",
        newPassword
    );

    message.style.color =
        "green";

    message.innerHTML =
        "✓ Password changed successfully!";

    setTimeout(function() {

        showLogin();

    }, 1500);

}

function backToLogin() {

    showLogin();

}
