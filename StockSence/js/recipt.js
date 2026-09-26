
function newDelivery(){

    if(!confirm("Create a new delivery?")){
        return;
    }

    document.getElementById("deliveryAddress").value = "";

    document.getElementById("scheduleDate").value = "";

    document.getElementById("responsible").value = "";

    document.getElementById("reference").textContent =
        generateReference();
}


function generateReference(){

    const number =
        Math.floor(1000 + Math.random() * 9000);

    return "WH/OUT/" + number;
}

function changeStatus(button){

    document
        .querySelectorAll(".status button")
        .forEach(function(btn){

            btn.classList.remove("active");

        });

    button.classList.add("active");
}

function validateDelivery(){

    const address =
        document
        .getElementById("deliveryAddress")
        .value
        .trim();

    const responsible =
        document
        .getElementById("responsible")
        .value
        .trim();

    const products =
        document
        .querySelectorAll(
            "#productList .product-row"
        );


    if(!address){

        alert(
            "Please enter Delivery Address."
        );

        return;
    }


    if(!responsible){

        alert(
            "Please enter Responsible person."
        );

        return;
    }


    if(products.length === 0){

        alert(
            "Please add at least one product."
        );

        return;
    }


    document
        .querySelectorAll(".status button")
        .forEach(function(btn){

            btn.classList.remove("active");

        });


    document
        .querySelectorAll(".status button")[3]
        .classList.add("active");


    alert(
        "Delivery validated successfully."
    );
}


function printDelivery(){

    window.print();
}


function cancelDelivery(){

    if(
        confirm(
            "Are you sure you want to cancel this delivery?"
        )
    ){

        alert(
            "Delivery cancelled."
        );

    }
}


function openProductModal(){

    document
        .getElementById("productModal")
        .style.display = "flex";
}


function closeProductModal(){

    document
        .getElementById("productModal")
        .style.display = "none";
}

function addProduct(){

    const product =
        document
        .getElementById("newProduct")
        .value;

    const quantity =
        document
        .getElementById("newQuantity")
        .value;


    if(!product){

        alert(
            "Please select a product."
        );

        return;
    }


    if(quantity <= 0){

        alert(
            "Please enter valid quantity."
        );

        return;
    }


    const row =
        document.createElement("div");

    row.className = "product-row";


    row.innerHTML = `

        <select>

            <option>${product}</option>

        </select>

        <input
            type="number"
            value="${quantity}"
            min="1"
        >

        <button
            class="remove-btn"
            onclick="removeProduct(this)">

            Remove

        </button>

    `;


    document
        .getElementById("productList")
        .appendChild(row);


    document
        .getElementById("newProduct")
        .value = "";


    document
        .getElementById("newQuantity")
        .value = 1;


    closeProductModal();
}

function removeProduct(button){

    button
        .parentElement
        .remove();
}

function saveDraft(){

    alert(
        "Delivery saved as Draft."
    );
}

function goBack(){

    window.location.href =
        "dashboard.html";
}