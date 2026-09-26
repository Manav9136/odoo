

function searchProducts(){

    const input =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#stockTableBody tr"
        );


    rows.forEach(function(row){

        const product =
            row
            .querySelector(".product-name")
            .textContent
            .toLowerCase();


        if(product.includes(input)){

            row.style.display = "";

        }
        else{

            row.style.display = "none";

        }

    });

}



function openUpdateModal(
    product,
    onHand,
    free
){

    document
        .getElementById("updateProduct")
        .value = product;


    document
        .getElementById("updateOnHand")
        .value = onHand;


    document
        .getElementById("updateFree")
        .value = free;


    document
        .getElementById("updateModal")
        .style.display = "flex";

}


function closeUpdateModal(){

    document
        .getElementById("updateModal")
        .style.display = "none";

}



function updateStock(){

    const product =
        document
        .getElementById("updateProduct")
        .value;


    const onHand =
        document
        .getElementById("updateOnHand")
        .value;


    const free =
        document
        .getElementById("updateFree")
        .value;


    if(onHand < 0 || free < 0){

        alert(
            "Stock values cannot be negative."
        );

        return;

    }


    if(Number(free) > Number(onHand)){

        alert(
            "Free to Use cannot be greater than On Hand."
        );

        return;

    }


    alert(
        product +
        " stock updated successfully."
    );


    closeUpdateModal();

}

function openAddProductModal(){

    document
        .getElementById("addProductModal")
        .style.display = "flex";

}



function closeAddProductModal(){

    document
        .getElementById("addProductModal")
        .style.display = "none";

}



function addProduct(){

    const name =
        document
        .getElementById("productName")
        .value
        .trim();


    const cost =
        document
        .getElementById("productCost")
        .value;


    const stock =
        document
        .getElementById("initialStock")
        .value;


    if(!name){

        alert(
            "Please enter product name."
        );

        return;

    }


    if(cost === "" || Number(cost) < 0){

        alert(
            "Please enter valid unit cost."
        );

        return;

    }


    if(stock === "" || Number(stock) < 0){

        alert(
            "Please enter valid initial stock."
        );

        return;

    }


    alert(
        name +
        " added successfully."
    );


    closeAddProductModal();

}


window.onclick = function(event){

    const updateModal =
        document.getElementById("updateModal");


    const addModal =
        document.getElementById("addProductModal");


    if(event.target === updateModal){

        closeUpdateModal();

    }


    if(event.target === addModal){

        closeAddProductModal();

    }

};

