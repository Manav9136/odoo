
function goDashboard() {
    window.location.href = "dashboard.html";
}

function goOperations() {
    window.location.href = "operations.html";
}

function goStock() {
    window.location.href = "stock.html";
}

function goHistory() {
    window.location.href = "move-history.html";
}

function goSettings() {
    window.location.href = "settings.html";
}

function goProfile() {
    window.location.href = "profile.html";
}

function goReceipts() {
    window.location.href = "receipts.html";
}

function goDeliveries() {
    window.location.href = "deliveries.html";
}


function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "login.html";
    }
}
