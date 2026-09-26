
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
    window.location.href = "history.html";
}

function goSettings() {
    window.location.href = "setting.html";
}

function goProfile() {
    window.location.href = "profile.html";
}

function goReceipts() {
    window.location.href = "recipt.html";
}

function goDeliveries() {
    window.location.href = "delivery.html";
}


function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (confirmLogout) {
        window.location.href = "index.html";
    }
}
