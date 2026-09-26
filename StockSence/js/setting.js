function showSection(section, button){

    document
        .querySelectorAll(".settings-section")
        .forEach(function(item){

            item.classList.remove("active");

        });


    document
        .querySelectorAll(".settings-tab")
        .forEach(function(item){

            item.classList.remove("active");

        });


    document
        .getElementById(section)
        .classList.add("active");


    button.classList.add("active");

}

function saveWarehouse(){

    const name =
        document
        .getElementById("warehouseName")
        .value
        .trim();


    const code =
        document
        .getElementById("shortCode")
        .value
        .trim();


    const address =
        document
        .getElementById("warehouseAddress")
        .value
        .trim();


    if(!name){

        alert("Please enter warehouse name.");
        return;

    }


    if(!code){

        alert("Please enter warehouse short code.");
        return;

    }


    if(!address){

        alert("Please enter warehouse address.");
        return;

    }


    localStorage.setItem(
        "warehouseName",
        name
    );

    localStorage.setItem(
        "warehouseCode",
        code
    );

    localStorage.setItem(
        "warehouseAddress",
        address
    );


    alert(
        "Warehouse details saved successfully."
    );

}

function resetWarehouse(){

    document
        .getElementById("warehouseName")
        .value = "";

    document
        .getElementById("shortCode")
        .value = "";

    document
        .getElementById("warehouseAddress")
        .value = "";

}

function saveLocation(){

    const name =
        document
        .getElementById("locationName")
        .value
        .trim();


    const code =
        document
        .getElementById("locationCode")
        .value
        .trim();


    const warehouse =
        document
        .getElementById("locationWarehouse")
        .value;


    if(!name){

        alert("Please enter location name.");
        return;

    }


    if(!code){

        alert("Please enter location short code.");
        return;

    }


    if(!warehouse){

        alert("Please select warehouse.");
        return;

    }


    localStorage.setItem(
        "locationName",
        name
    );

    localStorage.setItem(
        "locationCode",
        code
    );

    localStorage.setItem(
        "locationWarehouse",
        warehouse
    );


    alert(
        "Location details saved successfully."
    );

}

function resetLocation(){

    document
        .getElementById("locationName")
        .value = "";

    document
        .getElementById("locationCode")
        .value = "";

    document
        .getElementById("locationWarehouse")
        .value = "";

}

window.onload = function(){

    document
        .getElementById("warehouseName")
        .value =
        localStorage.getItem("warehouseName") || "";


    document
        .getElementById("shortCode")
        .value =
        localStorage.getItem("warehouseCode") || "";


    document
        .getElementById("warehouseAddress")
        .value =
        localStorage.getItem("warehouseAddress") || "";


    document
        .getElementById("locationName")
        .value =
        localStorage.getItem("locationName") || "";


    document
        .getElementById("locationCode")
        .value =
        localStorage.getItem("locationCode") || "";


    document
        .getElementById("locationWarehouse")
        .value =
        localStorage.getItem("locationWarehouse") || "";

};
