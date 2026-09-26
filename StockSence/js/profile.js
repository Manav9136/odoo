import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/*  NAVIGATION  */

window.goDashboard = function () {
    window.location.href = "dashboard.html";
};

window.goOperations = function () {
    window.location.href = "recipt.html";
};

window.goStock = function () {
    window.location.href = "stock.html";
};

window.goHistory = function () {
    window.location.href = "history.html";
};

window.goSettings = function () {
    window.location.href = "setting.html";
};

window.goProfile = function () {
    window.location.href = "profile.html";
};

window.logout = async function () {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        await signOut(auth);
        window.location.href = "index.html";
    }
};


/*  PROFILE DATA  */

let currentUser = null;
let currentDocData = {};

function getInitial(name) {

    if (!name) {
        return "A";
    }

    return name.trim().charAt(0).toUpperCase();
}

function fillFields(data) {

    const fullName =
        data.fullName || data.loginId || "Admin";

    const email =
        currentUser.email || "";

    const employeeId =
        data.employeeId || "";

    const phone =
        data.phone || "";

    const role =
        data.role || "Inventory Manager";

    const warehouse =
        data.warehouse || "Main Warehouse";


    document.getElementById("fullName").value = fullName;
    document.getElementById("employeeId").value = employeeId;
    document.getElementById("profileEmail").value = email;
    document.getElementById("profilePhone").value = phone;
    document.getElementById("profileRoleSelect").value = role;
    document.getElementById("profileWarehouseSelect").value = warehouse;

    updateProfileDisplay(fullName, role, employeeId, warehouse);
}

function updateProfileDisplay(name, role, empId, warehouse) {

    const initial = getInitial(name);

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileRole").textContent = role;
    document.getElementById("profileEmpId").textContent = empId || "—";
    document.getElementById("profileWarehouse").textContent = warehouse;
    document.getElementById("profileAvatar").textContent = initial;

    document.getElementById("headerUserName").textContent = name;
    document.getElementById("headerUserRole").textContent = role;
    document.getElementById("headerAvatar").textContent = initial;
}

async function loadProfile(user) {

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    currentDocData = snapshot.exists() ? snapshot.data() : {};

    fillFields(currentDocData);
}

function resetProfile() {

    document.getElementById("profileMessage").innerHTML = "";
    fillFields(currentDocData);
}

async function saveProfile() {

    const fullName =
        document.getElementById("fullName").value.trim();

    const employeeId =
        document.getElementById("employeeId").value.trim();

    const phone =
        document.getElementById("profilePhone").value.trim();

    const role =
        document.getElementById("profileRoleSelect").value;

    const warehouse =
        document.getElementById("profileWarehouseSelect").value;

    const message =
        document.getElementById("profileMessage");


    if (!fullName) {

        message.style.color = "red";
        message.innerHTML = "Please enter your full name.";
        return;
    }

    if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) {

        message.style.color = "red";
        message.innerHTML = "Please enter a valid phone number.";
        return;
    }

    const updatedData = {
        ...currentDocData,
        fullName,
        employeeId,
        phone,
        role,
        warehouse
    };

    try {

        await setDoc(
            doc(db, "users", currentUser.uid),
            updatedData,
            { merge: true }
        );

        currentDocData = updatedData;

        updateProfileDisplay(fullName, role, employeeId, warehouse);

        message.style.color = "green";
        message.innerHTML = "✓ Profile updated successfully.";

    } catch (error) {

        console.error("SAVE PROFILE ERROR:", error);

        message.style.color = "red";
        message.innerHTML = "✗ Could not save changes. Please try again.";
    }
}


/*  PASSWORD  */

function resetPasswordFields() {

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
}

async function changePassword() {

    const current =
        document.getElementById("currentPassword").value;

    const newPass =
        document.getElementById("newPassword").value;

    const confirmPass =
        document.getElementById("confirmNewPassword").value;

    const message =
        document.getElementById("passwordMessage");


    if (!current) {

        message.style.color = "red";
        message.innerHTML = "Please enter your current password.";
        return;
    }

    if (newPass.length < 8) {

        message.style.color = "red";
        message.innerHTML = "New password must contain at least 8 characters.";
        return;
    }

    if (newPass !== confirmPass) {

        message.style.color = "red";
        message.innerHTML = "✗ New passwords do not match.";
        return;
    }

    try {

        const credential =
            EmailAuthProvider.credential(currentUser.email, current);

        await reauthenticateWithCredential(currentUser, credential);

        await updatePassword(currentUser, newPass);

        message.style.color = "green";
        message.innerHTML = "✓ Password updated successfully.";

        resetPasswordFields();

    } catch (error) {

        console.error("CHANGE PASSWORD ERROR:", error);

        if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {

            message.style.color = "red";
            message.innerHTML = "✗ Current password is incorrect.";

        } else {

            message.style.color = "red";
            message.innerHTML = "✗ Could not update password. Please try again.";
        }
    }
}


/*  WIRE UP BUTTONS  */

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("saveProfileBtn")
        .addEventListener("click", saveProfile);

    document.getElementById("cancelProfileBtn")
        .addEventListener("click", resetProfile);

    document.getElementById("updatePasswordBtn")
        .addEventListener("click", changePassword);

    document.getElementById("cancelPasswordBtn")
        .addEventListener("click", resetPasswordFields);
});


/*  AUTH GUARD  */

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    currentUser = user;
    loadProfile(user);
});
