
function searchMoves(){

    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();


    const rows =
        document.querySelectorAll(
            "#moveTable tr"
        );


    rows.forEach(function(row){

        const text =
            row.textContent.toLowerCase();


        row.style.display =
            text.includes(search)
            ? ""
            : "none";

    });

}



function newMove(){

    document
        .getElementById("moveModal")
        .style.display = "flex";

}




function closeModal(){

    document
        .getElementById("moveModal")
        .style.display = "none";

}




function saveMove(){

    const contact =
        document
        .getElementById("contact")
        .value
        .trim();

    const from =
        document
        .getElementById("fromLocation")
        .value;

    const to =
        document
        .getElementById("toLocation")
        .value;

    const quantity =
        document
        .getElementById("quantity")
        .value;


    if(!contact){

        alert("Please enter contact.");
        return;

    }


    if(!from){

        alert("Please select From location.");
        return;

    }


    if(!to){

        alert("Please select To location.");
        return;

    }


    if(from === to){

        alert(
            "From and To locations cannot be same."
        );

        return;

    }


    if(!quantity || quantity <= 0){

        alert("Please enter valid quantity.");
        return;

    }


    alert(
        "Stock move created successfully."
    );


    closeModal();

}




function showMove(reference){

    alert(
        "Move Reference: " +
        reference
    );

}




function listView(button){

    document
        .querySelectorAll(".view-btn")
        .forEach(function(btn){

            btn.classList.remove("active");

        });

    button.classList.add("active");

    document
        .querySelector(".move-table")
        .style.display = "table";

}




function boardView(button){

    document
        .querySelectorAll(".view-btn")
        .forEach(function(btn){

            btn.classList.remove("active");

        });

    button.classList.add("active");

    alert(
        "Board View is ready for implementation."
    );

}




window.onclick = function(event){

    const modal =
        document.getElementById("moveModal");

    if(event.target === modal){

        closeModal();

    }

};
