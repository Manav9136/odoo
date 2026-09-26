
function openModal() {

    document.getElementById(
        "deliveryModal"
    ).style.display = "flex";

}


function closeModal() {

    document.getElementById(
        "deliveryModal"
    ).style.display = "none";

}


function createDelivery() {

    alert(
        "Delivery created successfully."
    );

    closeModal();

}


function searchTable() {

    const input =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#deliveryTable tbody tr"
        );


    rows.forEach(row => {

        row.style.display =
            row.innerText
            .toLowerCase()
            .includes(input)
            ? ""
            : "none";

    });

}


function listView() {

    document.getElementById(
        "listView"
    ).style.display = "block";

    document.getElementById(
        "kanbanView"
    ).style.display = "none";

}


function kanbanView() {

    document.getElementById(
        "listView"
    ).style.display = "none";

    document.getElementById(
        "kanbanView"
    ).style.display = "grid";

}