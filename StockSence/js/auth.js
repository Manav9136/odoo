import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

function showMessage(id, text, success = false) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = text;
    element.style.color = success ? "green" : "red";
  }
}


// =========================
// SIGN UP
// =========================

window.signup = async function (event) {
  event.preventDefault();

  const loginId = document
    .getElementById("signupId")
    .value.trim();

  const email = document
    .getElementById("email")
    .value.trim();

  const password =
    document.getElementById("signupPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;


  if (loginId.length < 6 || loginId.length > 12) {
    showMessage(
      "signupMessage",
      "Login ID must contain 6-12 characters."
    );
    return;
  }


  if (password.length < 8) {
    showMessage(
      "signupMessage",
      "Password must contain at least 8 characters."
    );
    return;
  }


  if (password !== confirmPassword) {
    showMessage(
      "signupMessage",
      "Passwords do not match."
    );
    return;
  }


  try {

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    await setDoc(
      doc(db, "users", result.user.uid),
      {
        loginId: loginId,
        email: email,
        createdAt: serverTimestamp()
      }
    );


    showMessage(
      "signupMessage",
      "Account created successfully!",
      true
    );


    await signOut(auth);

    setTimeout(() => {
      showLogin();
    }, 1200);


  } catch (error) {

    showMessage(
      "signupMessage",
      error.message
    );

  }
};


// =========================
// LOGIN
// =========================

window.login = async function (event) {
    event.preventDefault();

    const loginId = document
        .getElementById("loginId")
        .value.trim();

    const password = document
        .getElementById("password")
        .value;

    try {

        // Look up which email this Login ID belongs to
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("loginId", "==", loginId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            showMessage(
                "loginMessage",
                "Invalid Login ID or Password."
            );
            return;
        }

        const email = snapshot.docs[0].data().email;

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        showMessage(
            "loginMessage",
            "Login successful! Redirecting...",
            true
        );

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 800);

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        showMessage(
            "loginMessage",
            "Invalid Login ID or Password."
        );
    }
};


// =========================
// FORGOT PASSWORD
// =========================

window.sendOTP = async function (event) {

  event.preventDefault();


  const email = document
    .getElementById("forgotEmail")
    .value.trim();


  try {

    await sendPasswordResetEmail(
      auth,
      email
    );


    showMessage(
      "forgotMessage",
      "If the account exists, a reset link has been sent.",
      true
    );


  } catch (error) {

    showMessage(
      "forgotMessage",
      "Unable to send reset email."
    );

  }
};


// =========================
// LOGOUT
// =========================

window.logout = async function () {

  await signOut(auth);

  window.location.href = "index.html";

};


// =========================
// FORM NAVIGATION
// =========================

window.showLogin = function () {

  document.getElementById("loginForm").style.display = "block";

  document.getElementById("signupForm").style.display = "none";

  document.getElementById("forgotForm").style.display = "none";

};


window.showSignup = function () {

  document.getElementById("loginForm").style.display = "none";

  document.getElementById("signupForm").style.display = "block";

  document.getElementById("forgotForm").style.display = "none";

};


window.forgotPassword = function () {

  document.getElementById("loginForm").style.display = "none";

  document.getElementById("signupForm").style.display = "none";

  document.getElementById("forgotForm").style.display = "block";

};


window.backToLogin = window.showLogin;
