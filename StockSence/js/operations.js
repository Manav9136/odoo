
// =========================
// STATE
// =========================

let currentTab = "receipt";
let productRowCount = 0;

const refCounters = {
    receipt: 3,
    delivery: 2,
    transfer: 2,
    adjustment: 2
};

const refPrefix = {
    receipt: "WH/IN/",
    delivery: "WH/OUT/",
    transfer: "WH/INT/",
    adjustment: "WH/ADJ/"
};

const modalTitle = {
    receipt: "New Receipt",
    delivery: "New Delivery",
    transfer: "New Internal Transfer",
    adjustment: "New Stock Adjustment"
};


// =========================
// TABS
// =========================

function switchTab(type, button) {

    currentTab = type;

    document
        .querySelectorAll(".tab-btn")
        .forEach(function (btn) {
            btn.classList.remove("active");
        });

    button.classList.add("active");

    document
        .querySelectorAll(".tab-panel")
        .forEach(function (panel) {
            panel.style.display = "none";
        });

    document.getElementById("panel-" + type).style.display = "block";

    applyFilters();
}


// =========================
// FILTERS (search + status + warehouse)
// =========================

function applyFilters() {

    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value.toLowerCase();
    const warehouse = document.getElementById("warehouseFilter").value.toLowerCase();

    const rows = document.querySelectorAll("#tbody-" + currentTab + " tr");

    rows.forEach(function (row) {

        const text = row.textContent.toLowerCase();

        const matchesSearch = text.includes(search);
        const matchesStatus = !status || text.includes(status);
        const matchesWarehouse = !warehouse || text.includes(warehouse);

        row.style.display =
            (matchesSearch && matchesStatus && matchesWarehouse) ? "" : "none";
    });
}


// =========================
// NEW OPERATION MODAL
// =========================

function openNewModal() {
    configureModalForType(currentTab);
    document.getElementById("opModal").style.display = "flex";
}

function closeNewModal() {
    document.getElementById("opModal").style.display = "none";
}

function configureModalForType(type) {

    document.getElementById("modalTitle").textContent = modalTitle[type];

    document.getElementById("opReference").value =
        refPrefix[type] + String(refCounters[type]).padStart(4, "0");

    // reset product list
    document.getElementById("productList").innerHTML = "";
    productRowCount = 0;

    const partnerField = document.getElementById("partnerField");
    const warehouseField = document.getElementById("warehouseField");
    const dateField = document.getElementById("dateField");
    const transferFields = document.getElementById("transferFields");
    const adjustmentFields = document.getElementById("adjustmentFields");
    const productListField = document.getElementById("productListField");
    const partnerLabel = document.getElementById("partnerLabel");

    // hide everything first
    partnerField.style.display = "none";
    warehouseField.style.display = "none";
    dateField.style.display = "none";
    transferFields.style.display = "none";
    adjustmentFields.style.display = "none";
    productListField.style.display = "none";

    if (type === "receipt") {
        partnerLabel.textContent = "Supplier";
        partnerField.style.display = "block";
        warehouseField.style.display = "block";
        dateField.style.display = "block";
        productListField.style.display = "block";
        addProductRow();
    }

    if (type === "delivery") {
        partnerLabel.textContent = "Customer";
        partnerField.style.display = "block";
        warehouseField.style.display = "block";
        dateField.style.display = "block";
        productListField.style.display = "block";
        addProductRow();
    }

    if (type === "transfer") {
        transferFields.style.display = "block";
        productListField.style.display = "block";
        addProductRow();
    }

    if (type === "adjustment") {
        adjustmentFields.style.display = "block";
        // adjustment is single product/qty, no product list
    }

    document.getElementById("opPartner").value = "";
    document.getElementById("opContact").value = "";
    document.getElementById("opCountedQty").value = "";
}


// =========================
// PRODUCT LIST (Receipt / Delivery / Transfer)
// =========================

function addProductRow() {

    productRowCount++;

    const row = document.createElement("div");
    row.className = "product-row";

    row.innerHTML =
        '<select class="row-product">' +
        '<option>Steel Rods</option>' +
        '<option>Chairs</option>' +
        '<option>Wooden Panels</option>' +
        '</select>' +
        '<input type="number" class="row-qty" min="1" value="1">' +
        '<button type="button" class="remove-btn" onclick="removeProductRow(this)">Remove</button>';

    document.getElementById("productList").appendChild(row);
}

function removeProductRow(button) {
    button.parentElement.remove();
}


// =========================
// SAVE OPERATION
// =========================

function saveOperation() {

    const type = currentTab;
    const reference = document.getElementById("opReference").value;

    if (type === "receipt" || type === "delivery") {

        const partner = document.getElementById("opPartner").value.trim();
        const warehouse = document.getElementById("opWarehouse").value;
        const date = document.getElementById("opDate").value;

        if (!partner) {
            alert("Please enter " + (type === "receipt" ? "Supplier" : "Customer") + ".");
            return;
        }

        if (!date) {
            alert("Please select a Scheduled Date.");
            return;
        }

        if (document.querySelectorAll("#productList .product-row").length === 0) {
            alert("Please add at least one product.");
            return;
        }

        const displayDate = formatDate(date);

        const row = document.createElement("tr");
        row.innerHTML =
            '<td class="reference">' + reference + '</td>' +
            '<td>' + partner + '</td>' +
            '<td>' + warehouse + '</td>' +
            '<td>' + displayDate + '</td>' +
            '<td><span class="status status-waiting">Waiting</span></td>';

        document.getElementById("tbody-" + type).prepend(row);

        alert(
            reference + " created as Draft. Validate it from the list to " +
            (type === "receipt" ? "increase" : "decrease") + " stock automatically."
        );
    }

    if (type === "transfer") {

        const from = document.getElementById("opFrom").value;
        const to = document.getElementById("opTo").value;
        const contact = document.getElementById("opContact").value.trim();

        if (from === to) {
            alert("From and To locations cannot be the same.");
            return;
        }

        if (!contact) {
            alert("Please enter a contact / responsible person.");
            return;
        }

        if (document.querySelectorAll("#productList .product-row").length === 0) {
            alert("Please add at least one product.");
            return;
        }

        const row = document.createElement("tr");
        row.innerHTML =
            '<td class="reference">' + reference + '</td>' +
            '<td>' + from + '</td>' +
            '<td>' + to + '</td>' +
            '<td>' + contact + '</td>' +
            '<td><span class="status status-waiting">Waiting</span></td>';

        document.getElementById("tbody-transfer").prepend(row);

        alert(reference + " created. Total stock is unchanged, only location updates once validated.");
    }

    if (type === "adjustment") {

        const product = document.getElementById("opProduct").value;
        const location = document.getElementById("opAdjLocation").value;
        const countedQty = document.getElementById("opCountedQty").value;

        if (countedQty === "" || Number(countedQty) < 0) {
            alert("Please enter a valid counted quantity.");
            return;
        }

        const row = document.createElement("tr");
        row.innerHTML =
            '<td class="reference">' + reference + '</td>' +
            '<td>' + product + '</td>' +
            '<td>' + location + '</td>' +
            '<td>' + countedQty + '</td>' +
            '<td><span class="status status-done">Done</span></td>';

        document.getElementById("tbody-adjustment").prepend(row);

        alert(reference + " logged. Stock for " + product + " at " + location + " updated to " + countedQty + ".");
    }

    refCounters[type]++;
    closeNewModal();
}


// =========================
// HELPERS
// =========================

function formatDate(isoDate) {

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const parts = isoDate.split("-");

    return parts[2] + " " + months[Number(parts[1]) - 1] + " " + parts[0];
}


// close modal when clicking outside the box
window.onclick = function (event) {

    const modal = document.getElementById("opModal");

    if (event.target === modal) {
        closeNewModal();
    }
};
